import { CompanyCard } from "@/components/cards";

export function TopCompanies() {
  const companies = [
    "Tokopedia",
    "Shopee",
    "Telkom Indonesia",
    "Unilever",
    "Ernst & Young",
    "Traveloka",
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Top Reviewed Companies</h2>
          <a href="#" className="text-green-600 hover:underline">
            Lihat semua
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {companies.map((company) => (
            <CompanyCard 
              key={company} 
              companyName={company} 
              companyAbbreviation={company} 
              website="" 
              isPartner={false} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
