import { StrictMode, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import MarketingLayout from './layouts/MarketingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy-loaded pages - Marketing
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Demo = lazy(() => import('./pages/Demo'));
const Industries = lazy(() => import('./pages/Industries'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Marketing info pages
const PlatformPage = lazy(() => import('./pages/Platform'));
const ProductIntelligence = lazy(() => import('./pages/ProductIntelligence'));
const DataQualityPage = lazy(() => import('./pages/DataQualityPage'));
const Integrations = lazy(() => import('./pages/Integrations'));

// Lazy-loaded pages - Dashboard
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'));
const Products = lazy(() => import('./pages/dashboard/Products'));
const ProductDetail = lazy(() => import('./pages/dashboard/ProductDetail'));
const DataQuality = lazy(() => import('./pages/dashboard/DataQuality'));
const Enrichment = lazy(() => import('./pages/dashboard/Enrichment'));
const Validation = lazy(() => import('./pages/dashboard/Validation'));
const Review = lazy(() => import('./pages/dashboard/Review'));
const Agents = lazy(() => import('./pages/dashboard/Agents'));
const Evidence = lazy(() => import('./pages/dashboard/Evidence'));
const Taxonomy = lazy(() => import('./pages/dashboard/Taxonomy'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const Exports = lazy(() => import('./pages/dashboard/Exports'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <Suspense fallback={<LoadingScreen />}><Home /></Suspense> },
      { path: '/about', element: <Suspense fallback={<LoadingScreen />}><About /></Suspense> },
      { path: '/pricing', element: <Suspense fallback={<LoadingScreen />}><Pricing /></Suspense> },
      { path: '/faq', element: <Suspense fallback={<LoadingScreen />}><FAQ /></Suspense> },
      { path: '/demo', element: <Suspense fallback={<LoadingScreen />}><Demo /></Suspense> },
      { path: '/industries', element: <Suspense fallback={<LoadingScreen />}><Industries /></Suspense> },
      { path: '/industries/:slug', element: <Suspense fallback={<LoadingScreen />}><IndustryDetail /></Suspense> },
      { path: '/resources', element: <Suspense fallback={<LoadingScreen />}><Resources /></Suspense> },
      { path: '/blog', element: <Suspense fallback={<LoadingScreen />}><Blog /></Suspense> },
      { path: '/blog/:slug', element: <Suspense fallback={<LoadingScreen />}><BlogPost /></Suspense> },
      { path: '/case-studies', element: <Suspense fallback={<LoadingScreen />}><CaseStudies /></Suspense> },
      { path: '/case-studies/:slug', element: <Suspense fallback={<LoadingScreen />}><CaseStudyDetail /></Suspense> },
      { path: '/platform', element: <Suspense fallback={<LoadingScreen />}><PlatformPage /></Suspense> },
      { path: '/product-intelligence', element: <Suspense fallback={<LoadingScreen />}><ProductIntelligence /></Suspense> },
      { path: '/data-quality', element: <Suspense fallback={<LoadingScreen />}><DataQualityPage /></Suspense> },
      { path: '/enrichment', element: <Suspense fallback={<LoadingScreen />}><Enrichment /></Suspense> },
      { path: '/integrations', element: <Suspense fallback={<LoadingScreen />}><Integrations /></Suspense> },
      { path: '/login', element: <Suspense fallback={<LoadingScreen />}><Login /></Suspense> },
      { path: '/signup', element: <Suspense fallback={<LoadingScreen />}><Signup /></Suspense> },
      { path: '/forgot-password', element: <Suspense fallback={<LoadingScreen />}><ForgotPassword /></Suspense> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <Suspense fallback={<LoadingScreen />}><DashboardOverview /></Suspense> },
      { path: '/products', element: <Suspense fallback={<LoadingScreen />}><Products /></Suspense> },
      { path: '/products/:id', element: <Suspense fallback={<LoadingScreen />}><ProductDetail /></Suspense> },
      { path: '/dashboard/data-quality', element: <Suspense fallback={<LoadingScreen />}><DataQuality /></Suspense> },
      { path: '/dashboard/enrichment', element: <Suspense fallback={<LoadingScreen />}><Enrichment /></Suspense> },
      { path: '/dashboard/validation', element: <Suspense fallback={<LoadingScreen />}><Validation /></Suspense> },
      { path: '/review', element: <Suspense fallback={<LoadingScreen />}><Review /></Suspense> },
      { path: '/agents', element: <Suspense fallback={<LoadingScreen />}><Agents /></Suspense> },
      { path: '/evidence', element: <Suspense fallback={<LoadingScreen />}><Evidence /></Suspense> },
      { path: '/taxonomy', element: <Suspense fallback={<LoadingScreen />}><Taxonomy /></Suspense> },
      { path: '/analytics', element: <Suspense fallback={<LoadingScreen />}><Analytics /></Suspense> },
      { path: '/exports', element: <Suspense fallback={<LoadingScreen />}><Exports /></Suspense> },
      { path: '/settings', element: <Suspense fallback={<LoadingScreen />}><Settings /></Suspense> },
    ],
  },
]);

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
