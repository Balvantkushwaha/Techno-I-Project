import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import CategoriesSection from './CategoriesSection';
import AutoScrollSection from './AutoScrollSection';
import CTASection from './CTASection';
import { products } from '../../../data/products';
import ProductScrollSection from './ProductScrollSection';
import OfferSection from './OfferSection';
import PromoGrid from './PromoGrid';

const HomePage = () => {
  const trending = products.filter((product) => product.trending).slice(0, 16);
  const eyeglasses = products.filter((product) => product.category === 'eyeglasses').slice(0, 16);
  const sunglasses = products.filter((product) => product.category === 'sunglasses').slice(0, 16);
  const lenses = products.filter((product) => product.category === 'lenses').slice(0, 16);
  const men = products.filter((product) => product.gender === 'men').slice(0, 16);
  const women = products.filter((product) => product.gender === 'women').slice(0, 16);
  const unisex = products.filter((product) => product.gender === 'unisex').slice(0, 16);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />

      <AutoScrollSection title="Trending Products" products={trending} />
      <ProductScrollSection title="Featured Eyeglasses" products={eyeglasses} category="eyeglasses"/>
      <ProductScrollSection title="Top Sunglasses" products={sunglasses} category="sunglasses" />
      <ProductScrollSection title="Premium Contact Lenses" products={lenses} category="lenses" />
      <OfferSection />
      <AutoScrollSection title="Men's Collection" products={men}  />
      <AutoScrollSection title="Women's Collection" products={women} />
      <AutoScrollSection title="Unisex Collection" products={unisex} />

      <PromoGrid/>

      <CTASection />
    </>
  );
};

export default HomePage;
