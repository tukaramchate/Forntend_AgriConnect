import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// Lazy load components that might not be visible on initial render
const TeamSection = lazy(() => import('../components/about/TeamSection'));
const TimelineSection = lazy(() => import('../components/about/TimelineSection'));
const TestimonialsSection = lazy(() => import('../components/about/TestimonialsSection'));

// Import utility for smooth counter animation
import { animateCounter } from '../utils/animations';

// Import services
// import { getCompanyStats } from '../services/companyService';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [counters, setCounters] = useState({
    farmers: 0,
    products: 0,
    customers: 0,
    orders: 0
  });
  const [ setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs for intersection observer
  const statsRef = useRef(null);
  const valuesRef = useRef(null);

  // Fetch company statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Uncomment when API is ready:
        // const data = await getCompanyStats();
        
        // Mock data for now
        const data = {
          farmers: 5000,
          products: 15000,
          customers: 25000,
          orders: 100000,
          year_founded: 2020,
          sustainable_farms: 3500
        };
        
        // Start with zero values
        setCounters({
          farmers: 0,
          products: 0,
          customers: 0,
          orders: 0
        });
        
        setIsLoading(false);
        
        // Set up intersection observer for stats section
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Animate counter only when section is visible
              animateCounter({
                startValue: 0,
                endValue: data.farmers,
                duration: 2000,
                onUpdate: value => setCounters(prev => ({ ...prev, farmers: Math.floor(value) }))
              });
              
              animateCounter({
                startValue: 0,
                endValue: data.products,
                duration: 2000,
                onUpdate: value => setCounters(prev => ({ ...prev, products: Math.floor(value) }))
              });
              
              animateCounter({
                startValue: 0,
                endValue: data.customers,
                duration: 2000,
                onUpdate: value => setCounters(prev => ({ ...prev, customers: Math.floor(value) }))
              });
              
              animateCounter({
                startValue: 0,
                endValue: data.orders,
                duration: 2000,
                onUpdate: value => setCounters(prev => ({ ...prev, orders: Math.floor(value) }))
              });
              
              // Disconnect observer after animation starts
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        
        if (statsRef.current) {
          observer.observe(statsRef.current);
        }
        
        return () => observer.disconnect();
      } catch (err) {
        console.error('Error fetching company stats:', err);
        setError('Failed to load company information. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [setIsLoading]);

  // Add animation for values section
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.ac-value-card').forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 150);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    
    if (valuesRef.current) {
      observer.observe(valuesRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Promoting sustainable farming practices for a healthier planet'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building trust between farmers and consumers through transparency'
    },
    {
      icon: '📈',
      title: 'Growth',
      description: 'Enabling growth for farmers and providing fresh produce to consumers'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Using technology to revolutionize agricultural commerce'
    },
    {
      icon: '🌍',
      title: 'Community',
      description: 'Creating a thriving community of farmers and conscious consumers'
    },
    {
      icon: '✨',
      title: 'Quality',
      description: 'Ensuring the highest quality products reach every customer'
    }
  ];

  const tabContent = {
    mission: {
      title: 'Our Mission',
      content: (
        <div className="ac-tab-content">
          <p>
            At AgriConnect, our mission is to revolutionize the agricultural supply chain by creating a 
            direct bridge between farmers and consumers. We believe that fresh, quality produce should 
            be accessible to everyone while ensuring farmers receive fair compensation for their hard work.
          </p>
          <p>
            We are committed to promoting sustainable farming practices, reducing food waste, and building 
            a more transparent and efficient agricultural ecosystem that benefits all stakeholders.
          </p>
          <div className="ac-mission-points">
            <div className="ac-mission-point">
              <h4>🌾 Empowering Farmers</h4>
              <p>Providing farmers with direct market access and fair pricing for their produce.</p>
            </div>
            <div className="ac-mission-point">
              <h4>🥬 Fresh Produce</h4>
              <p>Delivering the freshest, highest quality produce directly from farms to consumers.</p>
            </div>
            <div className="ac-mission-point">
              <h4>🌍 Sustainability</h4>
              <p>Promoting eco-friendly farming practices and reducing environmental impact.</p>
            </div>
          </div>
        </div>
      )
    },
    vision: {
      title: 'Our Vision',
      content: (
        <div className="ac-tab-content">
          <p>
            Our vision is to become India's leading platform for sustainable agriculture, where every 
            farmer has access to modern technology and fair markets, and every consumer can easily 
            access fresh, organic, and locally-grown produce.
          </p>
          <p>
            We envision a future where technology and tradition work hand in hand to create a more 
            sustainable, equitable, and prosperous agricultural ecosystem for generations to come.
          </p>
          <blockquote className="ac-vision-quote">
            "To create a world where sustainable agriculture thrives, farmers prosper, and consumers 
            enjoy the freshest produce while caring for our planet."
          </blockquote>
        </div>
      )
    },
    impact: {
      title: 'Our Impact',
      content: (
        <div className="ac-tab-content">
          <p>
            Since our inception, AgriConnect has made a significant impact on the agricultural community 
            and the environment. Here's how we're making a difference:
          </p>
          <div className="ac-impact-metrics">
            <div className="ac-impact-metric">
              <h4>Economic Impact</h4>
              <ul>
                <li>Increased farmer income by an average of 30%</li>
                <li>Reduced middleman costs by 40%</li>
                <li>Created employment for 2000+ people</li>
              </ul>
            </div>
            <div className="ac-impact-metric">
              <h4>Environmental Impact</h4>
              <ul>
                <li>Reduced food waste by 25%</li>
                <li>Promoted organic farming across 10,000+ acres</li>
                <li>Reduced carbon footprint through optimized logistics</li>
              </ul>
            </div>
            <div className="ac-impact-metric">
              <h4>Social Impact</h4>
              <ul>
                <li>Educated 5000+ farmers on sustainable practices</li>
                <li>Improved access to fresh produce in urban areas</li>
                <li>Built a community of conscious consumers</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  };

  // Show error if data fetch failed
  if (error) {
    return (
      <div className="ac-error-container">
        <div className="ac-error-message">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="ac-btn ac-btn--primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-about-page">
      {/* Hero Section */}
      <section className="ac-hero-section">
        <div className="ac-container">
          <div className="ac-hero-content">
            <div className="ac-hero-text">
              <h1 className="ac-hero-title">
                Connecting Farms to Tables
                <span className="ac-hero-highlight">Sustainably</span>
              </h1>
              <p className="ac-hero-description">
                AgriConnect is revolutionizing agriculture by creating direct connections between 
                farmers and consumers, ensuring fresh produce, fair prices, and sustainable practices.
              </p>
              <div className="ac-hero-actions">
                <Link to="/products" className="ac-btn ac-btn--primary">
                  Shop Fresh Produce
                </Link>
                <Link to="/register" className="ac-btn ac-btn--outline">
                  Join as Farmer
                </Link>
              </div>
            </div>
            <div className="ac-hero-image">
              <img 
                src="/assets/images/about/hero-image.jpg" 
                alt="Fresh vegetables and fruits" 
                loading="eager"
              />
              <div className="ac-hero-badge">
                <span className="ac-badge-text">100% Organic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="ac-stats-section" ref={statsRef}>
        <div className="ac-container">
          <div className="ac-stats-grid">
            <div className="ac-stat-card">
              <div className="ac-stat-icon">👩‍🌾</div>
              <div className="ac-stat-number">{counters.farmers.toLocaleString()}+</div>
              <div className="ac-stat-label">Happy Farmers</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-icon">🌽</div>
              <div className="ac-stat-number">{counters.products.toLocaleString()}+</div>
              <div className="ac-stat-label">Fresh Products</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-icon">👥</div>
              <div className="ac-stat-number">{counters.customers.toLocaleString()}+</div>
              <div className="ac-stat-label">Satisfied Customers</div>
            </div>
            <div className="ac-stat-card">
              <div className="ac-stat-icon">📦</div>
              <div className="ac-stat-number">{counters.orders.toLocaleString()}+</div>
              <div className="ac-stat-label">Orders Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Impact Tabs */}
      <section className="ac-tabs-section">
        <div className="ac-container">
          <div className="ac-tabs-wrapper">
            <div className="ac-tabs-nav" role="tablist">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`ac-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`tab-${tab}`}
                  id={`tab-btn-${tab}`}
                >
                  {tabContent[tab].title}
                </button>
              ))}
            </div>
            
            {Object.keys(tabContent).map((tab) => (
              <div 
                key={tab}
                id={`tab-${tab}`}
                className={`ac-tab-panel ${activeTab === tab ? 'active' : 'hidden'}`}
                role="tabpanel"
                aria-labelledby={`tab-btn-${tab}`}
              >
                <h2 className="ac-tab-title">{tabContent[tab].title}</h2>
                {tabContent[tab].content}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="ac-values-section" ref={valuesRef}>
        <div className="ac-container">
          <div className="ac-section-header">
            <h2 className="ac-section-title">Our Core Values</h2>
            <p className="ac-section-subtitle">
              The principles that guide everything we do at AgriConnect
            </p>
          </div>
          <div className="ac-values-grid">
            {values.map((value, index) => (
              <div key={index} className="ac-value-card">
                <div className="ac-value-icon">{value.icon}</div>
                <h3 className="ac-value-title">{value.title}</h3>
                <p className="ac-value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="ac-loading-section">Loading...</div>}>
        <TimelineSection />
      </Suspense>

      <Suspense fallback={<div className="ac-loading-section">Loading...</div>}>
        <TeamSection />
      </Suspense>

      <Suspense fallback={<div className="ac-loading-section">Loading...</div>}>
        <TestimonialsSection />
      </Suspense>

      {/* CTA Section */}
      <section className="ac-cta-section">
        <div className="ac-container">
          <div className="ac-cta-content">
            <h2 className="ac-cta-title">Join the AgriConnect Community</h2>
            <p className="ac-cta-description">
              Whether you're a farmer looking to reach more customers or a consumer seeking 
              fresh, quality produce, we'd love to have you as part of our growing community.
            </p>
            <div className="ac-cta-actions">
              <Link to="/register" className="ac-btn ac-btn--primary">
                Get Started Today
              </Link>
              <Link to="/contact" className="ac-btn ac-btn--outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;