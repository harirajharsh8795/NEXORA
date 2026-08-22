import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './components/pages/LandingPage';
import CatalogPage from './components/pages/CatalogPage';
import InfoModal from './components/ui/InfoModal';
import type { ModalType } from './components/ui/InfoModal';

import './index.css';

function MainLayout() {
  const { currentPath } = useRouter();
  const isCatalog = currentPath === '/catalog';
  const [modalType, setModalType] = useState<ModalType>(null);

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar onOpenModal={(t) => setModalType(t)} />

      {/* Route-Based Page View */}
      {isCatalog ? <CatalogPage /> : <LandingPage />}

      {/* Footer */}
      <Footer onOpenModal={(t) => setModalType(t)} />

      {/* Knowledge Base & Platform Modals */}
      <InfoModal type={modalType} onClose={() => setModalType(null)} />
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
