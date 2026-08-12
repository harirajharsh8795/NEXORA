import { Link } from 'react-router-dom';
import Logo from './Logo';

const footerLinks = {
  Platform: [
    { label: 'Product Intelligence', href: '/product-intelligence' },
    { label: 'Data Quality', href: '/data-quality' },
    { label: 'Validation', href: '/dashboard/validation' },
    { label: 'Enrichment', href: '/enrichment' },
    { label: 'Integrations', href: '/integrations' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Documentation', href: '/resources' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Industries', href: '/industries' },
    { label: 'Request Demo', href: '/demo' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-nexora-900 border-t border-white/[0.06]" role="contentinfo">
      <div className="app-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="full" />
            <p className="mt-4 text-sm text-nexora-400 max-w-sm leading-relaxed">
              Agentic Product Intelligence for the next generation of industrial commerce.
            </p>
            <p className="mt-6 text-xs text-nexora-600">
              AI generates. Rules verify. Evidence explains.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-nexora-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-nexora-600">
            © {new Date().getFullYear()} NEXORA. Built for the UniHack Challenge.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-xs text-nexora-500 hover:text-nexora-300 transition-colors">
              Privacy
            </Link>
            <Link to="/about" className="text-xs text-nexora-500 hover:text-nexora-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
