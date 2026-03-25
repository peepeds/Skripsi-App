import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { searchCompanies } from "@/api/companyApi";

export function SearchBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCompaniesPage = location.pathname === "/companies";
  const isHomePage = location.pathname === "/";

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced update URL for companies page
  const updateUrl = useCallback(
    (value) => {
      if (isCompaniesPage) {
        if (value.trim()) {
          navigate(`/companies?search=${encodeURIComponent(value)}`, { replace: true });
        } else {
          navigate("/companies", { replace: true });
        }
      }
    },
    [isCompaniesPage, navigate]
  );

  // Debounced search for dropdown (only on home page)
  const performSearch = useCallback(
    async (query) => {
      if (!isHomePage || !query.trim()) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchCompanies(query);
        if (response.success) {
          setSearchResults(response.result.slice(0, 5)); // Limit to 5 results
          setIsDropdownOpen(true);
        } else {
          setSearchResults([]);
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setIsDropdownOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isHomePage]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isCompaniesPage) {
        updateUrl(searchValue);
      } else if (isHomePage) {
        performSearch(searchValue);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, updateUrl, performSearch, isCompaniesPage, isHomePage]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleResultClick = (company) => {
    setIsDropdownOpen(false);
    setSearchValue("");
    // Navigate to company detail page using slug
    navigate(`/company/${company.companySlug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div id="searchbar-container" className="relative w-64">
      <InputGroup>
        <InputGroupInput
          placeholder="Search companies..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          onBlur={() => {
            // Delay hiding dropdown to allow clicks
            setTimeout(() => setIsDropdownOpen(false), 200);
          }}
        />
        <InputGroupAddon>
          <Search className="w-4 h-4 text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {isHomePage && isDropdownOpen && (searchResults.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500">Searching...</div>
          ) : (
            searchResults.map((company) => (
              <div
                key={company.companyId}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleResultClick(company)}
              >
                <div className="font-medium text-gray-900">{company.companyName}</div>
                <div className="text-sm text-gray-500">{company.companyAbbreviation}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
