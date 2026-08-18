import { useRouter } from '../../context/RouterContext';
import CatalogExplorer from '../catalog/CatalogExplorer';
import './CatalogPage.css';

export default function CatalogPage() {
  const { navigate } = useRouter();

  return (
    <div className="catalog-page">
      {/* Top Header Navigation Bar */}
      <div className="catalog-page__header glass-card--no-hover">
        <div className="catalog-page__header-inner">
          <button
            onClick={() => navigate('/')}
            className="catalog-page__back-btn"
          >
            <span className="back-arrow">←</span> Back to NEXORA Home
          </button>

          <div className="catalog-page__title-block">
            <span className="catalog-page__badge">LIVE WORKSPACE</span>
            <h1 className="catalog-page__title">
              NEXORA Catalog <span className="text-gradient">Intelligence Workspace</span>
            </h1>
            <p className="catalog-page__subtitle">
              Transform raw manufacturer data into validated, evidence-grounded, 252-column commerce-ready product intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace Content (Reusing CatalogExplorer component) */}
      <main className="catalog-page__content">
        <CatalogExplorer />
      </main>
    </div>
  );
}
