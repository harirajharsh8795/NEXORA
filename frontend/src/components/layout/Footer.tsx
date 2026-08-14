import './Footer.css';

const footerLinks = {
  product: [
    { label: 'Live Dashboard', href: '#catalog' },
    { label: 'Pipeline Architecture', href: '#pipeline' },
    { label: 'Evidence Explorer', href: '#catalog' },
    { label: 'ROI Calculator', href: '#roi-calculator' },
    { label: 'Taxonomy', href: '#taxonomy' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
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
            <span className="footer__badge">UNIHACK 2026</span>
            <span className="footer__badge">AI-Powered</span>
          </div>
        </div>

        {/* Link columns */}
        <div className="footer__links-group">
          <div className="footer__links-col">
            <h4 className="footer__col-title">Product</h4>
            {footerLinks.product.map((link) => (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
          </div>
          <div className="footer__links-col">
            <h4 className="footer__col-title">Resources</h4>
            {footerLinks.resources.map((link) => (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
          </div>
          <div className="footer__links-col">
            <h4 className="footer__col-title">Company</h4>
            {footerLinks.company.map((link) => (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Nexora AI. All rights reserved.</span>
        <span className="footer__built-with">
          Built with ❤️ for UNIHACK
        </span>
      </div>
    </footer>
  );
}
