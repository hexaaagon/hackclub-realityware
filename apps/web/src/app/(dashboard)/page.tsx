import { Reveal } from "@/components/motion";
import { FeaturedSection } from "./_components/home/featured-section";
import { HomeCards } from "./_components/home/home-cards";
import { HomeHero } from "./_components/home/home-hero";
import { HomeTutorial } from "./_components/home/home-tutorial";
import { YourProjectsSection } from "./_components/home/your-projects-section";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <HomeHero />
      <HomeCards />
      <Reveal>
        <HomeTutorial />
      </Reveal>
      <FeaturedSection />
      <YourProjectsSection />
    </div>
  );
}
