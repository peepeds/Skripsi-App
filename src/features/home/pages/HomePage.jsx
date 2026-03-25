import { HeroSection } from "@/features/home/sections/HeroSection";
import { TopCompanies } from "@/features/home/sections/TopCompanies";
import { HighlightReview } from "@/features/home/sections/HighlightReview";
import { CallToAction } from "@/features/home/sections/CallToAction";

export function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <TopCompanies />
      <HighlightReview />
      <CallToAction />
    </main>
  );
}
