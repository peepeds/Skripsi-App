import { ReviewCard } from "@/components/cards";

export default function HighlightReview() {
  const reviews = [
    {
      name: "Tuti — B24",
      company: "Telkom Indonesia",
      role: "Software Engineer",
      review:
        "Lingkungan kerja yang menantang dengan banyak kesempatan untuk belajar dan berkembang.",
    },
    {
      name: "Tono — B23",
      company: "Ernst & Young",
      role: "Tax Intern",
      review:
        "Pengalaman yang sangat berharga dengan proyek nyata dan bimbingan profesional.",
    },
    {
      name: "Jokow — B25",
      company: "Shopee",
      role: "Marketing Intern",
      review:
        "Budaya kerja yang dinamis dan kolaboratif serta banyak tugas yang menantang.",
    },
  ];

  return (
    <section className="bg-white px-8 md:px-20 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Highlight Review</h2>
        <a href="#" className="text-green-600 hover:underline">
          Baca review lengkap
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </div>
    </section>
  );
}
