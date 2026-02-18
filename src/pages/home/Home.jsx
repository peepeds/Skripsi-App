import { CallToAction } from "@/pages/home/CallToAction";
import { HeroSection } from "@/pages/home/HeroSection";
import { HighlightReview } from "@/pages/home/HighlightReview";
import { TopCompanies } from "@/pages/home/TopCompanies";

import { SearchBar } from "@/components/SearchBar";


export default function HomePage() {
  return (
   <main className="w-full">
      <HeroSection />
      <TopCompanies />
      <HighlightReview />
      <CallToAction />
    </main>
  )
}
