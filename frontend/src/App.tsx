import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './components/pages/LandingPage';
import CatalogPage from './components/pages/CatalogPage';

import './index.css';

function MainLayout() {
  const { currentPath } = useRouter();
  const isCatalog = currentPath === '/catalog';

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Route-Based Page View */}
      {isCatalog ? <CatalogPage /> : <LandingPage />}

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <MainLayout />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;

