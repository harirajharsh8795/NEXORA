import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'ROI Calculator', href: '#roi-calculator' },
  { label: 'Catalog', href: '#catalog' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar glass-card--no-hover">
      <div className="navbar__inner">
        {/* Logo */}
        <a href="#" className="navbar__logo">
          <img
            src="/logo.png"
            alt="Nexora AI"
            className="navbar__logo-img logo-glow"
          />
          <span className="navbar__logo-text">NEXORA</span>
        </a>

        {/* Navigation Links */}
        <nav className="navbar__nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
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
          <a href="#catalog" className="navbar__cta">
            Explore Live Demo
            <span className="navbar__cta-arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
