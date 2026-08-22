import { useRouter } from '../../context/RouterContext';
import type { ModalType } from '../ui/InfoModal';
import './Footer.css';

interface FooterProps {
  onOpenModal?: (type: ModalType) => void;
}

const productLinks = [
  { label: 'Live Dashboard', href: '/catalog' },
  { label: 'Pipeline Architecture', href: '#pipeline' },
  { label: 'Evidence Explorer', href: '/catalog' },
  { label: 'ROI Calculator', href: '#roi-calculator' },
  { label: 'Taxonomy', href: '#taxonomy' },
];

const resourceLinks: { label: string; action: ModalType }[] = [
  { label: 'Documentation', action: 'docs' },
  { label: 'API Reference', action: 'api' },
  { label: 'Case Studies', action: 'cases' },
  { label: 'Blog', action: 'blog' },
];

const companyLinks: { label: string; action: ModalType }[] = [
  { label: 'About', action: 'about' },
  { label: 'Contact', action: 'contact' },
  { label: 'Privacy Policy', action: 'privacy' },
];

export default function Footer({ onOpenModal }: FooterProps) {
  const { navigate } = useRouter();

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand column */}
        <div className="footer__brand">
          <img src="/logo.png" alt="Nexora AI" className="footer__logo logo-glow" />
          <p className="footer__tagline">
            Autonomous Product Intelligence &amp; Catalog Enrichment Engine.
            AI-powered multi-agent pipeline for enterprise product data.
          </p>
          <div className="footer__badges">
            <span className="footer__badge">Enterprise Edition</span>
            <span className="footer__badge">AI-Powered</span>
          </div>
        </div>

        {/* Link columns */}
        <div className="footer__links-group">
          <div className="footer__links-col">
            <h4 className="footer__col-title">Product</h4>
            {productLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                className="footer__link"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Resources</h4>
            {resourceLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onOpenModal && onOpenModal(link.action)}
                className="footer__link"
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Company</h4>
            {companyLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onOpenModal && onOpenModal(link.action)}
                className="footer__link"
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Nexora AI. All rights reserved.</span>
        <span className="footer__built-with">
          Built with ❤️ for Enterprise eCommerce
        </span>
      </div>
    </footer>
  );
}
