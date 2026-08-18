import { useTheme } from '../../context/ThemeContext';
import { useRouter } from '../../context/RouterContext';
import './Navbar.css';

const navLinks = [
  { label: 'Features', href: '#features', route: '/' },
  { label: 'Pipeline', href: '#pipeline', route: '/' },
  { label: 'ROI Calculator', href: '#roi-calculator', route: '/' },
  { label: 'Catalog', href: '/catalog', route: '/catalog' },
];

export default function Navbar() {
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
            const isActive = link.route === '/catalog' ? currentPath === '/catalog' : currentPath === '/';
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href === '/catalog' ? '/catalog' : link.href);
                }}
                className={`navbar__link ${isActive && link.route === '/catalog' ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
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

