import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UnauthenticatedModal } from "@/components/common/UnauthenticatedModal";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReviewWritePage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    rating: 5,
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // Check authentication
  if (!isAuthenticated) {
    return <UnauthenticatedModal redirectPath={location.pathname} />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to submit review
      console.log("Review submission:", { companyId, ...formData });
      // After successful submission
      navigate(`/company/${companyId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      // TODO: Add error handling/toast notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tulis Review</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Bagikan pengalaman Anda dengan perusahaan ini
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 - Sangat Buruk</option>
                    <option value={2}>2 - Buruk</option>
                    <option value={3}>3 - Cukup</option>
                    <option value={4}>4 - Baik</option>
                    <option value={5}>5 - Sangat Baik</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Review
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ringkas review Anda dalam judul singkat"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Isi Review
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Ceritakan pengalaman Anda secara detail..."
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Review"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(`/company/${companyId}`)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
