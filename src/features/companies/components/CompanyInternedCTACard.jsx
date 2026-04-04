import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CompanyInternedCTACard = ({ companySlug, companyName }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 bg-linear-to-br from-orange-50 to-orange-100 shadow-sm">
      <CardContent className="pt-8 pb-6">
        <div className="text-center space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Interned Here Before?
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Help other students by sharing your internship experience at {companyName}
          </p>
          <Button
            onClick={() => navigate(`/review/${companySlug}`)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors mt-4"
          >
            Write Review Here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
