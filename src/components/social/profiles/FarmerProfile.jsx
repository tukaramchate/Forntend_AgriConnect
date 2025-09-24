import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FadeIn from '../../animations/FadeIn';
import InteractiveButton from '../../interactions/InteractiveButton';
import { useToast } from '../../../hooks/useToast';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import './FarmerProfile.css';

/**
 * Comprehensive farmer profile component showcasing farmer's information,
 * products, reviews, and social features
 */
function FarmerProfile({ farmerId: propFarmerId }) {
  const { farmerId: paramFarmerId } = useParams();
  const farmerId = propFarmerId || paramFarmerId;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { handleAsyncError } = useErrorHandler();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [followersCount, setFollowersCount] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // Load farmer profile data
  useEffect(() => {
    if (!farmerId) return;

    const loadFarmerProfile = async () => {
      await handleAsyncError(
        async () => {
          setLoading(true);

          // Simulate API calls
          const [farmerData, productsData, reviewsData, followData] =
            await Promise.all([
              fetchFarmerData(farmerId),
              fetchFarmerProducts(farmerId),
              fetchFarmerReviews(farmerId),
              fetchFollowStatus(farmerId),
            ]);

          setFarmer(farmerData);
          setProducts(productsData);
          setReviews(reviewsData);
          setIsFollowing(followData.isFollowing);
          setFollowersCount(followData.followersCount);
          setLoading(false);
        },
        {
          context: 'farmer_profile_load',
          severity: 'medium',
          showToUser: true,
          customMessage: 'Failed to load farmer profile. Please try again.',
        }
      );
    };

    loadFarmerProfile();
  }, [farmerId, handleAsyncError]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    await handleAsyncError(
      async () => {
        const newFollowStatus = !isFollowing;

        // Optimistic update
        setIsFollowing(newFollowStatus);
        setFollowersCount((prev) => (newFollowStatus ? prev + 1 : prev - 1));

        // API call
        await toggleFollow(farmerId, newFollowStatus);

        showToast({
          type: 'success',
          title: newFollowStatus ? 'Following!' : 'Unfollowed',
          message: newFollowStatus
            ? `You are now following ${farmer.name}`
            : `You unfollowed ${farmer.name}`,
          duration: 3000,
        });
      },
      {
        context: 'follow_toggle',
        severity: 'low',
        showToUser: true,
        onFailure: () => {
          // Revert optimistic update
          setIsFollowing(!isFollowing);
          setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
        },
      }
    );
  };

  // Handle contact farmer
  const handleContact = () => {
    if (!farmer.contactInfo.allowMessages) {
      showToast({
        type: 'info',
        title: 'Contact Unavailable',
        message: 'This farmer is not accepting direct messages at the moment.',
        duration: 4000,
      });
      return;
    }
    setShowContactModal(true);
  };

  // Handle share profile
  const handleShareProfile = async () => {
    const shareData = {
      title: `${farmer.name} - AgriConnect Farmer`,
      text: `Check out ${farmer.name}'s profile on AgriConnect`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast({
          type: 'success',
          title: 'Shared!',
          message: 'Profile link shared successfully',
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        showToast({
          type: 'success',
          title: 'Link Copied!',
          message: 'Profile link copied to clipboard',
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast({
          type: 'error',
          title: 'Share Failed',
          message: 'Unable to share profile link',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className='farmer-profile-loading'>
        <div className='loading-skeleton'>
          <div className='skeleton-header'></div>
          <div className='skeleton-content'></div>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className='farmer-profile-error'>
        <h2>Farmer Not Found</h2>
        <p>The farmer profile you're looking for doesn't exist.</p>
        <InteractiveButton onClick={() => navigate('/farmers')}>
          Browse Farmers
        </InteractiveButton>
      </div>
    );
  }

  return (
    <FadeIn className='farmer-profile'>
      {/* Hero Section */}
      <div className='farmer-hero'>
        <div className='farmer-hero-background'>
          <img
            src={farmer.coverImage || '/api/placeholder/1200/400'}
            alt={`${farmer.name}'s farm`}
            className='hero-background-image'
          />
          <div className='hero-overlay'></div>
        </div>

        <div className='farmer-hero-content'>
          <div className='farmer-avatar-section'>
            <img
              src={farmer.avatar || '/api/placeholder/120/120'}
              alt={farmer.name}
              className='farmer-avatar'
            />
            <div className='farmer-verification'>
              {farmer.verified && (
                <div className='verification-badge' title='Verified Farmer'>
                  <svg
                    className='verification-icon'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className='farmer-basic-info'>
            <h1 className='farmer-name'>{farmer.name}</h1>
            <p className='farmer-location'>
              <svg
                className='location-icon'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
              {farmer.location.city}, {farmer.location.state}
            </p>
            <p className='farmer-tagline'>{farmer.tagline}</p>

            <div className='farmer-stats'>
              <div className='stat'>
                <span className='stat-number'>{followersCount}</span>
                <span className='stat-label'>Followers</span>
              </div>
              <div className='stat'>
                <span className='stat-number'>{products.length}</span>
                <span className='stat-label'>Products</span>
              </div>
              <div className='stat'>
                <span className='stat-number'>{farmer.yearsExperience}</span>
                <span className='stat-label'>Years Experience</span>
              </div>
              <div className='stat'>
                <span className='stat-number'>{reviews.length}</span>
                <span className='stat-label'>Reviews</span>
              </div>
            </div>
          </div>

          <div className='farmer-actions'>
            <InteractiveButton
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={handleFollowToggle}
              className='follow-button'
            >
              {isFollowing ? 'Following' : 'Follow'}
            </InteractiveButton>

            <InteractiveButton
              variant='outline'
              onClick={handleContact}
              className='contact-button'
            >
              Contact
            </InteractiveButton>

            <InteractiveButton
              variant='ghost'
              onClick={handleShareProfile}
              className='share-button'
            >
              <svg
                className='share-icon'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z' />
              </svg>
              Share
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='farmer-nav'>
        <div className='nav-tabs'>
          {[
            { id: 'about', label: 'About', icon: 'user' },
            { id: 'products', label: 'Products', icon: 'grid' },
            { id: 'reviews', label: 'Reviews', icon: 'star' },
            { id: 'gallery', label: 'Gallery', icon: 'camera' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <svg className='tab-icon' viewBox='0 0 20 20' fill='currentColor'>
                {tab.icon === 'user' && (
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                )}
                {tab.icon === 'grid' && (
                  <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                )}
                {tab.icon === 'star' && (
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                )}
                {tab.icon === 'camera' && (
                  <path
                    fillRule='evenodd'
                    d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                    clipRule='evenodd'
                  />
                )}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className='farmer-content'>
        {activeTab === 'about' && (
          <FadeIn className='about-tab'>
            <div className='about-grid'>
              <div className='about-main'>
                <section className='about-section'>
                  <h3>About the Farm</h3>
                  <p>{farmer.description}</p>
                </section>

                <section className='specialties-section'>
                  <h3>Specialties</h3>
                  <div className='specialties-grid'>
                    {farmer.specialties.map((specialty, index) => (
                      <div key={index} className='specialty-card'>
                        <img
                          src={specialty.image || '/api/placeholder/80/80'}
                          alt={specialty.name}
                          className='specialty-image'
                        />
                        <div className='specialty-info'>
                          <h4>{specialty.name}</h4>
                          <p>{specialty.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className='certifications-section'>
                  <h3>Certifications & Awards</h3>
                  <div className='certifications-list'>
                    {farmer.certifications.map((cert, index) => (
                      <div key={index} className='certification-item'>
                        <div className='certification-badge'>
                          <svg
                            className='cert-icon'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                        <div className='certification-info'>
                          <h4>{cert.name}</h4>
                          <p>
                            {cert.issuer} • {cert.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className='about-sidebar'>
                <div className='contact-card'>
                  <h3>Contact Information</h3>
                  <div className='contact-details'>
                    <div className='contact-item'>
                      <svg
                        className='contact-icon'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <div>
                        <p className='contact-label'>Farm Location</p>
                        <p className='contact-value'>
                          {farmer.location.address}
                        </p>
                      </div>
                    </div>

                    {farmer.contactInfo.phone && (
                      <div className='contact-item'>
                        <svg
                          className='contact-icon'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                        </svg>
                        <div>
                          <p className='contact-label'>Phone</p>
                          <p className='contact-value'>
                            {farmer.contactInfo.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className='contact-item'>
                      <svg
                        className='contact-icon'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                      <div>
                        <p className='contact-label'>Email</p>
                        <p className='contact-value'>
                          {farmer.contactInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='farm-stats-card'>
                  <h3>Farm Statistics</h3>
                  <div className='farm-stats'>
                    <div className='farm-stat'>
                      <span className='stat-number'>{farmer.farmSize}</span>
                      <span className='stat-label'>Acres</span>
                    </div>
                    <div className='farm-stat'>
                      <span className='stat-number'>{farmer.totalSales}</span>
                      <span className='stat-label'>Total Sales</span>
                    </div>
                    <div className='farm-stat'>
                      <span className='stat-number'>
                        {farmer.sustainabilityScore}/10
                      </span>
                      <span className='stat-label'>Sustainability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {activeTab === 'products' && (
          <FadeIn className='products-tab'>
            <div className='products-header'>
              <h3>Available Products ({products.length})</h3>
              <div className='products-filters'>
                <select className='filter-select'>
                  <option value=''>All Categories</option>
                  <option value='vegetables'>Vegetables</option>
                  <option value='fruits'>Fruits</option>
                  <option value='grains'>Grains</option>
                  <option value='herbs'>Herbs</option>
                </select>
                <select className='sort-select'>
                  <option value='newest'>Newest First</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='popular'>Most Popular</option>
                </select>
              </div>
            </div>

            <div className='products-grid'>
              {products.map((product) => (
                <div key={product.id} className='product-card'>
                  <div className='product-image-container'>
                    <img
                      src={product.image || '/api/placeholder/250/200'}
                      alt={product.name}
                      className='product-image'
                    />
                    {product.isOrganic && (
                      <div className='organic-badge'>Organic</div>
                    )}
                  </div>

                  <div className='product-info'>
                    <h4 className='product-name'>{product.name}</h4>
                    <p className='product-description'>{product.description}</p>
                    <div className='product-details'>
                      <span className='product-price'>${product.price}/lb</span>
                      <span className='product-availability'>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <InteractiveButton
                      variant='primary'
                      size='small'
                      onClick={() => navigate(`/products/${product.id}`)}
                      className='view-product-button'
                    >
                      View Details
                    </InteractiveButton>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {activeTab === 'reviews' && (
          <FadeIn className='reviews-tab'>
            <div className='reviews-header'>
              <h3>Customer Reviews ({reviews.length})</h3>
              <div className='reviews-summary'>
                <div className='rating-overview'>
                  <div className='average-rating'>
                    <span className='rating-number'>
                      {farmer.averageRating}
                    </span>
                    <div className='rating-stars'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`star ${star <= farmer.averageRating ? 'filled' : ''}`}
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      ))}
                    </div>
                    <span className='rating-count'>
                      Based on {reviews.length} reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='reviews-list'>
              {reviews.map((review) => (
                <div key={review.id} className='review-card'>
                  <div className='review-header'>
                    <div className='reviewer-info'>
                      <img
                        src={review.user.avatar || '/api/placeholder/40/40'}
                        alt={review.user.name}
                        className='reviewer-avatar'
                      />
                      <div className='reviewer-details'>
                        <h4 className='reviewer-name'>{review.user.name}</h4>
                        <div className='review-meta'>
                          <div className='review-rating'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`star ${star <= review.rating ? 'filled' : ''}`}
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                              </svg>
                            ))}
                          </div>
                          <span className='review-date'>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='review-content'>
                    <p className='review-text'>{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className='review-images'>
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className='review-image'
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {review.farmerResponse && (
                    <div className='farmer-response'>
                      <div className='response-header'>
                        <img
                          src={farmer.avatar || '/api/placeholder/32/32'}
                          alt={farmer.name}
                          className='farmer-response-avatar'
                        />
                        <span className='response-label'>
                          Response from {farmer.name}
                        </span>
                      </div>
                      <p className='response-text'>{review.farmerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {activeTab === 'gallery' && (
          <FadeIn className='gallery-tab'>
            <div className='gallery-header'>
              <h3>Farm Gallery</h3>
              <p>Explore {farmer.name}'s farm through photos</p>
            </div>

            <div className='gallery-grid'>
              {farmer.galleryImages?.map((image, index) => (
                <div key={index} className='gallery-item'>
                  <img
                    src={image.url || '/api/placeholder/300/250'}
                    alt={image.caption || `Farm image ${index + 1}`}
                    className='gallery-image'
                  />
                  {image.caption && (
                    <div className='gallery-caption'>
                      <p>{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          farmer={farmer}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </FadeIn>
  );
}

// Contact Modal Component
function ContactModal({ farmer, onClose }) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast({
        type: 'success',
        title: 'Message Sent!',
        message: `Your message has been sent to ${farmer.name}`,
        duration: 4000,
      });

      onClose();
    } catch {
      showToast({
        type: 'error',
        title: 'Failed to Send',
        message: 'Unable to send your message. Please try again.',
        duration: 4000,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='contact-modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>Contact {farmer.name}</h3>
          <button className='modal-close' onClick={onClose}>
            <svg viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        <form className='contact-form' onSubmit={handleSendMessage}>
          <div className='form-group'>
            <label htmlFor='subject'>Subject</label>
            <input
              type='text'
              id='subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='message'>Message</label>
            <textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Write your message...'
              rows={5}
              required
            />
          </div>

          <div className='form-actions'>
            <InteractiveButton
              type='button'
              variant='secondary'
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </InteractiveButton>
            <InteractiveButton
              type='submit'
              variant='primary'
              disabled={sending || !message.trim()}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </InteractiveButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simulation functions (replace with actual API calls)
async function fetchFarmerData(farmerId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('Fetching farmer data for:', farmerId);

  return {
    id: farmerId,
    name: 'Green Valley Farm',
    avatar: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/1200/400',
    verified: true,
    location: {
      city: 'Fresno',
      state: 'California',
      address: '1234 Farm Road, Fresno, CA 93721',
    },
    tagline: 'Sustainable farming for a better tomorrow',
    description:
      'Green Valley Farm has been a family-owned operation for over 50 years, committed to sustainable farming practices and providing the freshest, highest-quality produce to our community. We specialize in organic vegetables, seasonal fruits, and heritage grains grown with care for both the environment and our customers.',
    yearsExperience: 25,
    farmSize: 150,
    totalSales: '2.5K+',
    sustainabilityScore: 9.2,
    averageRating: 4.8,
    specialties: [
      {
        name: 'Organic Vegetables',
        description:
          'Fresh, certified organic vegetables grown without pesticides',
        image: '/api/placeholder/80/80',
      },
      {
        name: 'Heritage Tomatoes',
        description: 'Rare heirloom tomato varieties with exceptional flavor',
        image: '/api/placeholder/80/80',
      },
      {
        name: 'Seasonal Fruits',
        description: 'Tree-ripened fruits harvested at peak freshness',
        image: '/api/placeholder/80/80',
      },
    ],
    certifications: [
      { name: 'USDA Organic Certified', issuer: 'USDA', year: 2020 },
      {
        name: 'Sustainable Agriculture Award',
        issuer: 'California Farm Bureau',
        year: 2022,
      },
      {
        name: 'Water Conservation Excellence',
        issuer: 'State of California',
        year: 2023,
      },
    ],
    contactInfo: {
      email: 'info@greenvalleyfarm.com',
      phone: '(559) 555-0123',
      allowMessages: true,
    },
    galleryImages: [
      { url: '/api/placeholder/300/250', caption: 'Fresh harvest morning' },
      {
        url: '/api/placeholder/300/250',
        caption: 'Our heritage tomato varieties',
      },
      {
        url: '/api/placeholder/300/250',
        caption: 'Sustainable irrigation system',
      },
      { url: '/api/placeholder/300/250', caption: 'Farm team at work' },
      {
        url: '/api/placeholder/300/250',
        caption: 'Organic certification process',
      },
      { url: '/api/placeholder/300/250', caption: 'Community farmers market' },
    ],
  };
}

async function fetchFarmerProducts(farmerId) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.log('Fetching products for farmer:', farmerId);

  return [
    {
      id: 1,
      name: 'Organic Roma Tomatoes',
      description:
        'Vine-ripened organic Roma tomatoes, perfect for sauces and cooking',
      price: 4.99,
      image: '/api/placeholder/250/200',
      isOrganic: true,
      inStock: true,
      category: 'vegetables',
    },
    {
      id: 2,
      name: 'Heritage Carrots',
      description:
        'Rainbow variety heritage carrots with exceptional sweetness',
      price: 3.49,
      image: '/api/placeholder/250/200',
      isOrganic: true,
      inStock: true,
      category: 'vegetables',
    },
    {
      id: 3,
      name: 'Fresh Basil',
      description: 'Aromatic Italian basil grown in our greenhouses',
      price: 2.99,
      image: '/api/placeholder/250/200',
      isOrganic: true,
      inStock: false,
      category: 'herbs',
    },
  ];
}

async function fetchFarmerReviews(farmerId) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  console.log('Fetching reviews for farmer:', farmerId);

  return [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
      },
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Absolutely love the quality of produce from Green Valley Farm! The tomatoes are incredibly flavorful and you can really taste the difference. Will definitely be ordering again.',
      images: ['/api/placeholder/100/80', '/api/placeholder/100/80'],
      farmerResponse:
        "Thank you so much, Sarah! We're thrilled you enjoyed our tomatoes. It means the world to us when customers appreciate the care we put into our produce.",
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: '/api/placeholder/40/40',
      },
      rating: 5,
      date: '1 month ago',
      comment:
        'Fast delivery and excellent customer service. The heritage carrots were amazing - my kids actually asked for more vegetables!',
      farmerResponse:
        "That's wonderful to hear, Mike! Getting kids excited about vegetables is one of our favorite success stories.",
    },
    {
      id: 3,
      user: {
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/40/40',
      },
      rating: 4,
      date: '1 month ago',
      comment:
        'Great quality produce, though I wish there were more variety in the winter months. Overall very satisfied with my orders.',
    },
  ];
}

async function fetchFollowStatus(farmerId) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  console.log('Fetching follow status for farmer:', farmerId);

  return {
    isFollowing: false,
    followersCount: 1247,
  };
}

async function toggleFollow(farmerId, follow) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`${follow ? 'Following' : 'Unfollowing'} farmer:`, farmerId);
  return { success: true };
}

export default FarmerProfile;
