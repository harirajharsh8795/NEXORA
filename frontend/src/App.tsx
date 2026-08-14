import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HeroSection from './components/sections/HeroSection';
import BeforeAfterSlider from './components/sections/BeforeAfterSlider';
import StatsBar from './components/sections/StatsBar';
import FeatureDataQuality from './components/sections/FeatureDataQuality';
import FeatureProductIntelligence from './components/sections/FeatureProductIntelligence';
import FeatureCommerceReady from './components/sections/FeatureCommerceReady';
import PipelineSection from './components/sections/PipelineSection';
import ROICalculator from './components/sections/ROICalculator';
import ManualVsAgent from './components/sections/ManualVsAgent';
import EnterpriseGrid from './components/sections/EnterpriseGrid';
import IntegrationsSection from './components/sections/IntegrationsSection';
import TestimonialCards from './components/sections/TestimonialCards';
import TaxonomyExplorer from './components/sections/TaxonomyExplorer';
import PricingSection from './components/sections/PricingSection';
import FAQAccordion from './components/sections/FAQAccordion';
import CTABanner from './components/sections/CTABanner';

import CatalogExplorer from './components/catalog/CatalogExplorer';

import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Sections (Top-to-Bottom) */}
        <main>
          <HeroSection />
          <BeforeAfterSlider />
          <StatsBar />

          {/* Deep-Dive Features */}
          <FeatureDataQuality />
          <FeatureProductIntelligence />
          <FeatureCommerceReady />
          <PipelineSection />

          {/* Business Impact & Interactive Tools */}
          <ROICalculator />
          <ManualVsAgent />
          <EnterpriseGrid />
          <IntegrationsSection />
          <TestimonialCards />

          {/* Taxonomy & Live Interactive Catalog */}
          <TaxonomyExplorer />
          <CatalogExplorer />

          {/* Pricing, FAQ, and CTA */}
          <PricingSection />
          <FAQAccordion />
          <CTABanner />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
