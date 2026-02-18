import React, { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export function SearchBar() {
  const initItems = [
    { name: "Log In", path: "/Login" },
    { name: "Log Out", path: "/Logout" },
    { name: "Sign In", path: "/Signup" },
  ];

  const [items] = useState(initItems);
  const [filteredItems, setFilteredItems] = useState(initItems);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredItems(initItems);
      setShowDropdown(false);
    } else {
      const filtered = items.filter((x) =>
        x.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowDropdown(true);
    }
  };

  // Tutup dropdown kalau klik di luar search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!target.closest("#searchbar-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div id="searchbar-container" className="relative w-full max-w-md">
      <InputGroup className="rounded-lg border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition">
        <InputGroupInput
          placeholder="Cari perusahaan atau posisi magang..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none w-full"
        />
      <InputGroupAddon>
          <Search className="w-5 h-5 text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {showDropdown && (
        <div className="absolute mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </a>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>

  );
}
