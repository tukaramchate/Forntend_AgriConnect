import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Ramesh Patil',
      role: 'Farmer',
      location: 'Maharashtra',
      image: '/api/placeholder/100/100',
      text: 'AgriConnect has transformed my farming business. I now get fair prices for my produce and have direct access to customers across the country.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Anjali Desai',
      role: 'Customer',
      location: 'Bangalore',
      image: '/api/placeholder/100/100',
      text: 'The quality of produce I get through AgriConnect is exceptional. Knowing exactly which farm my food comes from gives me great confidence.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Suresh Reddy',
      role: 'Farmer',
      location: 'Andhra Pradesh',
      image: '/api/placeholder/100/100',
      text: 'The platform is so easy to use. I can list my products, track sales, and manage deliveries all from my phone. My income has increased by 40%!',
      rating: 4,
    },
    {
      id: 4,
      name: 'Neha Singh',
      role: 'Restaurant Owner',
      location: 'Delhi',
      image: '/api/placeholder/100/100',
      text: 'We source all our ingredients through AgriConnect. The freshness and quality have helped elevate our dishes, and our customers notice the difference.',
      rating: 5,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`ac-star ${i < rating ? 'ac-star--filled' : 'ac-star--empty'}`}
        >
          {i < rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <section className='ac-testimonials-section'>
      <div className='ac-container'>
        <div className='ac-section-header'>
          <h2 className='ac-section-title'>What People Say</h2>
          <p className='ac-section-subtitle'>
            Hear from our community of farmers and customers
          </p>
        </div>

        <div className='ac-testimonials-carousel'>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`ac-testimonial-card ${index === activeIndex ? 'active' : ''}`}
              aria-hidden={index !== activeIndex}
            >
              <div className='ac-testimonial-content'>
                <div className='ac-testimonial-rating'>
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className='ac-testimonial-text'>
                  "{testimonial.text}"
                </blockquote>
              </div>
              <div className='ac-testimonial-author'>
                <div className='ac-testimonial-author-image'>
                  <img src={testimonial.image} alt='' loading='lazy' />
                </div>
                <div className='ac-testimonial-author-info'>
                  <h4 className='ac-testimonial-author-name'>
                    {testimonial.name}
                  </h4>
                  <p className='ac-testimonial-author-role'>
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='ac-testimonials-dots'>
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              className={`ac-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
