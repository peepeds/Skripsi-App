import { useState, useEffect } from "react";
import { getCompanyBySlug } from "@/api/companyApi";

const useCompanyDetail = (slug) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCompanyDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCompanyBySlug(slug);

        if (response.data.success) {
          // Handle dummy response where result is just the slug string
          if (typeof response.data.result === 'string') {
            setCompany({
              companySlug: response.data.result,
              companyName: response.data.result.charAt(0).toUpperCase() + response.data.result.slice(1),
              companyAbbreviation: response.data.result.toUpperCase(),
              website: `${response.data.result}.com`,
              isPartner: false,
              companyId: 999 // dummy ID
            });
          } else {
            setCompany(response.data.result);
          }
        } else {
          setError(response.data.message || "Failed to fetch company details");
        }
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [slug]);

  return { company, loading, error };
};

export default useCompanyDetail;