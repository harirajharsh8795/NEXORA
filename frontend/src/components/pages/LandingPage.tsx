import HeroSection from '../sections/HeroSection';
import BeforeAfterSlider from '../sections/BeforeAfterSlider';
import StatsBar from '../sections/StatsBar';
import FeatureDataQuality from '../sections/FeatureDataQuality';
import FeatureProductIntelligence from '../sections/FeatureProductIntelligence';
import FeatureCommerceReady from '../sections/FeatureCommerceReady';
import PipelineSection from '../sections/PipelineSection';
import ROICalculator from '../sections/ROICalculator';
import ManualVsAgent from '../sections/ManualVsAgent';
import EnterpriseGrid from '../sections/EnterpriseGrid';
import IntegrationsSection from '../sections/IntegrationsSection';
import TaxonomyExplorer from '../sections/TaxonomyExplorer';
import CatalogCalloutSection from '../sections/CatalogCalloutSection';
import FAQAccordion from '../sections/FAQAccordion';
import CTABanner from '../sections/CTABanner';

export default function LandingPage() {
  return (
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

      {/* Taxonomy & Live Interactive Catalog Workspace Teaser */}
      <TaxonomyExplorer />
      <CatalogCalloutSection />

      {/* FAQ and CTA */}
      <FAQAccordion />
      <CTABanner />
    </main>
  );
}
