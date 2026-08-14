import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './TestimonialCards.css';

export default function TestimonialCards() {
  const testimonials = [
    {
      quote: "NEXORA eliminated 80% of our manual catalog review backlog in less than 48 hours. The LOV guardrails mean zero hallucinations in our downstream Shopify store.",
      name: "Sarah Jenkins",
      title: "VP of Product Content",
      company: "Apex Industrial Supply (Fictional Demo Persona)"
    },
    {
      quote: "The Evidence Graph is a game changer. When an auditor or manufacturer asks where an attribute came from, we can point to the exact spec PDF line number.",
      name: "Marcus Vance",
      title: "Director of PIM Operations",
      company: "Global Logistics & Fasteners (Fictional Demo Persona)"
    },
    {
      quote: "We enriched over 50,000 raw supplier SKUs with 100% manufacturer resolution accuracy. Our search conversion increased by 34% within 30 days.",
      name: "Elena Rostova",
      title: "Head of E-Commerce Engineering",
      company: "OmniChannel Distribution (Fictional Demo Persona)"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-section__inner">
        <SectionHeader
          tag="PROJECT IMPACT &amp; PERSPECTIVE"
          title="Designed for Catalog Operations"
          titleAccent="Leaders"
          subtitle="How automated multi-agent catalog enrichment addresses key pain points for B2B industrial distributors."
        />

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="testimonial-card">
              <div className="testimonial-card-top">
                <span className="quote-mark">“</span>
                <span className="illustrative-badge">Illustrative Persona Example</span>
              </div>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <h4 className="author-name">{t.name}</h4>
                  <span className="author-title">{t.title} • {t.company}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
