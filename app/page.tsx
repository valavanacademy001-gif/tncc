import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import CategorySection from '@/components/sections/CategorySection';
import CreativeNetwork from '@/components/sections/CreativeNetwork';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import HowItWorks from '@/components/sections/HowItWorks';
import StackingCards from '@/components/sections/StackingCards';
import CommunityStory from '@/components/sections/CommunityStory';
import Testimonials from '@/components/sections/Testimonials';
import PricingSection from '@/components/sections/PricingSection';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CategorySection />
      <FeaturedProjects />
      <CreativeNetwork />
      <HowItWorks />
      <StackingCards />
      <CommunityStory />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
