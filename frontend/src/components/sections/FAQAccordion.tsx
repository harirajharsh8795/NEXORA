import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { MOCK_FAQS } from '../../data/mockData';
import './FAQAccordion.css';

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <div className="faq-section__inner">
        <SectionHeader
          tag="FREQUENTLY ASKED QUESTIONS"
          title="Got Questions? We Have"
          titleAccent="Answers"
          subtitle="Everything you need to know about NEXORA's evidence graph, LOV compliance, entity resolution, and API integration."
        />

        <div className="faq-list">
          {MOCK_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Card key={idx} className={`faq-card ${isOpen ? 'faq-card--open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
