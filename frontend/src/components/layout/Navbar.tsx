import { useTheme } from '../../context/ThemeContext';
import { useRouter } from '../../context/RouterContext';
import type { ModalType } from '../ui/InfoModal';
import './Navbar.css';

interface NavbarProps {
  onOpenModal?: (type: ModalType) => void;
}

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'ROI Calculator', href: '#roi-calculator' },
  { label: 'Taxonomy', href: '#taxonomy' },
  { label: 'Catalog Workspace', href: '/catalog' },
];

export default function Navbar({ onOpenModal }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentPath, navigate } = useRouter();

  return (
    <header className="navbar glass-card--no-hover">
      <div className="navbar__inner">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="navbar__logo"
        >
          <img
            src="/logo.png"
            alt="Nexora AI"
            className="navbar__logo-img logo-glow"
          />
          <span className="navbar__logo-text">NEXORA</span>
        </a>

        {/* Navigation Links */}
        <nav className="navbar__nav">
          {navLinks.map((link) => {
            const isCatalogLink = link.href === '/catalog';
            const isActive = isCatalogLink ? currentPath === '/catalog' : currentPath === '/';
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                className={`navbar__link ${isActive && isCatalogLink ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}

          <button
            onClick={() => onOpenModal && onOpenModal('docs')}
            className="navbar__link"
            style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
          >
            Docs
          </button>
          <button
            onClick={() => onOpenModal && onOpenModal('api')}
            className="navbar__link"
            style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
          >
            API
          </button>
        </nav>

        {/* Right side: theme toggle + CTA */}
        <div className="navbar__actions">
          <button
            onClick={toggleTheme}
            className="navbar__theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className="navbar__cta"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Open Live Catalog
            <span className="navbar__cta-arrow">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
