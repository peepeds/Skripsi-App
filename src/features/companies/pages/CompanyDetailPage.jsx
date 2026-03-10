import React from "react";
import { useParams } from "react-router-dom";
import useCompanyDetail from "../hooks/useCompanyDetail";
import { LoadingWrapper } from "@/components/ui/LoadingWrapper";

const CompanyDetailPage = () => {
  const { companySlug } = useParams();
  const { company, loading, error } = useCompanyDetail(companySlug);

  if (loading) {
    return <LoadingWrapper />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Company Not Found</h1>
          <p className="text-gray-600">The company you're looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Details</h1>
            <p className="text-gray-600">Dummy data for company slug: {companySlug}</p>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-blue-600">
                {company.companyAbbreviation.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{company.companyName}</h2>
              <p className="text-lg text-gray-600">{company.companyAbbreviation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company ID</label>
                  <p className="text-gray-900">{company.companyId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Slug</label>
                  <p className="text-gray-900">{company.companySlug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {company.website}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Partner Status</label>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      company.isPartner
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {company.isPartner ? "Partner" : "Not Partner"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">API Response</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">This is dummy data generated from the API response.</p>
                <div className="text-xs text-gray-500">
                  <p><strong>Success:</strong> true</p>
                  <p><strong>Message:</strong> Dummy company data for slug: {companySlug}</p>
                  <p><strong>Result:</strong> {company.companySlug}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;