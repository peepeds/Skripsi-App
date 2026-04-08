import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { UnauthenticatedModal } from "@/components/common/UnauthenticatedModal";
import { createCompanyRequest } from "@/api/companyApi";
import { getCategories } from "@/api/categoryApi";

const schema = z.object({
  companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  companyAbbreviation: z.string().min(1, "Singkatan perusahaan wajib diisi"),
  website: z.string().url("Format URL tidak valid (contoh: https://example.com)"),
  isPartner: z.boolean(),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  subcategoryId: z.coerce.number({ invalid_type_error: "Subkategori wajib dipilih" }).min(1, "Subkategori wajib dipilih"),
});

export const AddCompanyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      companyAbbreviation: "",
      website: "",
      isPartner: false,
      bio: "",
      subcategoryId: "",
    },
  });

  const isPartner = watch("isPartner");

  useEffect(() => {
    let cancelled = false;
    getCategories("companies").then((res) => {
      if (!cancelled && res.success) setCategories(res.result);
    });
    return () => { cancelled = true; };
  }, []);

  if (!isAuthenticated) {
    return <UnauthenticatedModal redirectPath={location.pathname} />;
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createCompanyRequest(data);
      toast.success("Submitted successfully.");
      navigate("/companies");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit request..";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = categories.find((c) => c.categoryId === Number(selectedCategoryId));
  const subcategories = selectedCategory?.subCategories ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Page header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Company</h1>
        <p className="text-gray-500 mb-8">
          Help other students by adding company information. Your submission will be verified before publication.
        </p>

        {/* Form card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
            {/* Section header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={20} className="text-amber-600" />
                <h2 className="text-lg font-bold text-gray-900">Company Information</h2>
              </div>
              <p className="text-sm text-gray-500">Data dasar mengenai perusahaan yang ingin kamu tambahkan.</p>
            </div>

            <hr className="border-gray-100" />

            {/* Company Name + Abbreviation */}
            <div className="flex gap-4">
              <div className="flex-[3]">
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  {...register("companyName")}
                  placeholder="PT. Nama Perusahaan"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
              </div>

              <div className="flex-[1]">
                <label htmlFor="companyAbbreviation" className="block text-sm font-semibold text-gray-900 mb-2">
                  Singkatan <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyAbbreviation"
                  type="text"
                  {...register("companyAbbreviation")}
                  placeholder="CI"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                {errors.companyAbbreviation && <p className="text-red-500 text-xs mt-1">{errors.companyAbbreviation.message}</p>}
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                Website <span className="text-red-500">*</span>
              </label>
              <input
                id="website"
                type="url"
                {...register("website")}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
            </div>

            {/* Category + Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryFilter"
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setValue("subcategoryId", "");
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subcategoryId" className="block text-sm font-semibold text-gray-900 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  id="subcategoryId"
                  {...register("subcategoryId", {
                    onChange: () => trigger("subcategoryId"),
                  })}
                  disabled={!selectedCategoryId}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Pilih subkategori</option>
                  {subcategories.map((sub) => (
                    <option key={sub.subCategoryId} value={sub.subCategoryId}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
                {errors.subcategoryId && <p className="text-red-500 text-xs mt-1">{errors.subcategoryId.message}</p>}
              </div>
            </div>

            {/* Is Partner */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                BINUS Partner?
              </label>
              <div className="flex gap-3">
                {[
                  { label: "Ya, Partner BINUS", value: true },
                  { label: "Bukan Partner", value: false },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setValue("isPartner", opt.value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      isPartner === opt.value
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-900 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                placeholder="Ceritakan sedikit tentang perusahaan ini..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
              />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Footer actions */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border border-gray-200 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
