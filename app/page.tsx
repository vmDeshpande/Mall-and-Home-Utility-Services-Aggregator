import { HeroSection } from '@/components/sections/hero-section';
import { CategoryGrid } from '@/components/sections/category-grid';
import { TopProvidersSection } from '@/components/sections/top-providers-section';
import { HowItWorks } from '@/components/sections/how-it-works';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <main className="bg-background">
      <HeroSection />
      <CategoryGrid />
      <TopProvidersSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
