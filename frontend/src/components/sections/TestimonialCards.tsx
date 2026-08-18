import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './TestimonialCards.css';

export default function TestimonialCards() {
  const testimonials = [
    {
      quote: "NEXORA offers structured LOV guardrails and UOM standardization, streamlining catalog enrichment for complex distributor SKU files.",
      name: "Sarah Jenkins",
      title: "VP of Product Content",
      company: "Apex Industrial Supply (Illustrative Persona Example)"
    },
    {
      quote: "The Evidence Graph is a major asset. Being able to trace every attribute directly back to source URLs and PDF snippets gives catalog managers complete confidence.",
      name: "Marcus Vance",
      title: "Director of PIM Operations",
      company: "Global Logistics & Fasteners (Illustrative Persona Example)"
    },
    {
      quote: "Standardizing unbranded vendor inputs and generating 252-column commerce-ready files dramatically reduces manual data entry overhead.",
      name: "Elena Rostova",
      title: "Head of E-Commerce Engineering",
      company: "OmniChannel Distribution (Illustrative Persona Example)"
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
