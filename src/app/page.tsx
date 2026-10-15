import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromotionalBanner } from '@/components/home/PromotionalBanner';
import { BrandBenefits } from '@/components/home/BrandBenefits';
import { NewsletterSection } from '@/components/layout/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromotionalBanner />
      <BrandBenefits />
      <NewsletterSection />
    </>
  );
}
