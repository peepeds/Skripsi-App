export function CompanyCard({ name }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 text-center hover:shadow-md transition">
      <div className="h-12 flex items-center justify-center mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
          {name.charAt(0)}
        </div>
      </div>
      <h3 className="font-medium">{name}</h3>
      <div className="text-yellow-400 mt-2">★★★★★</div>
    </div>
  );
}
