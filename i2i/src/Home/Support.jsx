import React, { useState } from 'react';
import './style1.css'; // Ensure your CSS styles for this component are available
import { Link } from "react-router-dom"; // Import Link from React Router
import './Support.css';
// Data for FAQ items
const faqData = [
  {
    question: "What is HDMIS Number?",
    answer:
      "HDMIS Number is a 14-digit number that uniquely identifies you in India's healthcare ecosystem.",
  },
  {
    question: "What is HDMIS Number?",
    answer:
      "HDMIS Number is a unique identifier used to access your health records digitally.",
  },
  {
    question: "Linking HDMIS Number with HDMIS Address",
    answer:
      "You can link your HDMIS Number with your HDMIS Number for seamless integration.",
  },
  {
    question: "Voluntary Opt-out?",
    answer:
      "You can voluntarily opt out of the HDMIS ecosystem if you no longer wish to participate.",
  },
];

const Support = () => {
  // activeIndex holds the index of the currently open FAQ item
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle the FAQ item: close it if already active; otherwise open it
  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    
    <section className="faq-section">
      {/* Support Text */}
      <div className="faq-support">
        <h3 style={{color:"white"}}>Support</h3>
        <h2>FAQ's</h2>
        <p>
          Everything you need to know about the HDMIS number. Can't find the answers you are looking for?
        </p>
        <Link to="/contact"className="btn Contact_us_btn">Contact Us</Link>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-accordion">
        {faqData.map((faq, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span style={{ marginLeft: '10px',color:'white'}}>
                {activeIndex === index ? '▲' : '▼'}
              </span>
            </button>
            {activeIndex === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        <div className="know-more">
          <a href="#" style={{color:"white"}}>Know More &#9654;</a>
        </div>
      </div>
    </section>
  );
};

export default Support;
