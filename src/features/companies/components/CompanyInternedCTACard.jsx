import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UnauthenticatedModal } from "@/components/common/UnauthenticatedModal";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CompanyInternedCTACard = ({ companySlug, companyName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    navigate(`/review/${companySlug}`);
  };

  return (
    <Card className="border border-orange-100 bg-linear-to-br from-orange-50 to-orange-100 shadow-sm">
      <CardContent className="px-5 py-6 md:px-6 md:py-7">
        <div className="space-y-4 text-center">
          <h3 className="font-plus-jakarta text-lg font-bold text-gray-900">
            Interned Here Before?
          </h3>
          <p className="font-inter text-sm leading-relaxed text-gray-700">
            Help other students by sharing your internship experience at {companyName}
          </p>
          <Button
            onClick={handleWriteReview}
            className="mt-1 w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Write Review Here
          </Button>
        </div>
      </CardContent>

      {showAuthModal && (
        <UnauthenticatedModal
          redirectPath={location.pathname}
          onClose={() => setShowAuthModal(false)}
          message="You need to log in first to start sharing your internship experience."
        />
      )}
    </Card>
  );
};
