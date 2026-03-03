import { CompanyCard } from "@/components/cards";

export default function TopCompanies() {
  const companies = [
    "Tokopedia",
    "Shopee",
    "Telkom Indonesia",
    "Unilever",
    "Ernst & Young",
    "Traveloka",
  ];

  return (
    <section className="px-8 md:px-20 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Top Reviewed Companies</h2>
        <a href="#" className="text-green-600 hover:underline">
          Lihat semua
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company} name={company} />
        ))}
      </div>
    </section>
  );
}
