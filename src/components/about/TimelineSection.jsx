import React, { useRef, useEffect } from 'react';

const TimelineSection = () => {
  const timelineRef = useRef(null);
  
  const milestones = [
    {
      year: '2020',
      title: 'AgriConnect Founded',
      description: 'Started with a vision to connect farmers directly with consumers'
    },
    {
      year: '2021',
      title: 'First 1000 Farmers',
      description: 'Onboarded our first 1000 farmers across 5 states'
    },
    {
      year: '2022',
      title: 'Mobile App Launch',
      description: 'Launched mobile app making it easier for farmers to list products'
    },
    {
      year: '2023',
      title: '10,000+ Products',
      description: 'Expanded catalog to over 10,000 fresh products'
    },
    {
      year: '2024',
      title: 'National Expansion',
      description: 'Expanded operations to cover all major cities in India'
    },
    {
      year: '2025',
      title: 'Sustainable Future',
      description: 'Leading the sustainable agriculture revolution'
    }
  ];
  
  // Add animation for timeline items
  useEffect(() => {
    if (!timelineRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.ac-timeline-item');
          
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 200);
          });
          
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(timelineRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ac-timeline-section">
      <div className="ac-container">
        <div className="ac-section-header">
          <h2 className="ac-section-title">Our Journey</h2>
          <p className="ac-section-subtitle">
            Key milestones in our mission to transform agriculture
          </p>
        </div>
        <div className="ac-timeline" ref={timelineRef}>
          {milestones.map((milestone, index) => (
            <div key={index} className="ac-timeline-item">
              <div className="ac-timeline-marker"></div>
              <div className="ac-timeline-content">
                <div className="ac-timeline-year">{milestone.year}</div>
                <h3 className="ac-timeline-title">{milestone.title}</h3>
                <p className="ac-timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;