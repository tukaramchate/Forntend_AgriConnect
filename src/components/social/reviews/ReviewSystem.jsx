import React, { useState, useEffect, useCallback } from 'react';
import FadeIn from '../../animations/FadeIn';
import InteractiveButton from '../../interactions/InteractiveButton';
import { useToast } from '../../../hooks/useToast';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import './ReviewSystem.css';

/**
 * Comprehensive review system with rating, commenting, image upload,
 * and review management features
 */
function ReviewSystem({ 
  targetId, 
  targetType = 'product', // 'product', 'farmer', 'order'
  currentUserId,
  allowAnonymous = false,
  showWriteReview = true 
}) {
  const { showToast } = useToast();
  const { handleAsyncError } = useErrorHandler();

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, [targetId, sortBy, filterBy, loadReviews]);

  const loadReviews = useCallback(async () => {
    await handleAsyncError(
      async () => {
        setLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          fetchReviews(targetId, targetType, { sortBy, filterBy }),
          fetchReviewStats(targetId, targetType)
        ]);
        
        setReviews(reviewsData);
        setReviewStats(statsData);
        setLoading(false);
      },
      {
        context: 'load_reviews',
        severity: 'medium',
        showToUser: true,
        customMessage: 'Failed to load reviews. Please try again.'
      }
    );
  }, [targetId, targetType, sortBy, filterBy, handleAsyncError]);

  if (loading) {
    return <ReviewSystemSkeleton />;
  }

  return (
    <FadeIn className="review-system">
      {/* Review Statistics */}
      <ReviewStats 
        stats={reviewStats} 
        targetType={targetType}
      />

      {/* Review Controls */}
      <div className="review-controls">
        <div className="review-filters">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="review-sort"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>

          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="review-filter"
          >
            <option value="all">All Reviews</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
            <option value="photos">With Photos</option>
            <option value="verified">Verified Purchases</option>
          </select>
        </div>

        {showWriteReview && (
          <InteractiveButton
            variant="primary"
            onClick={() => setShowReviewForm(true)}
            className="write-review-button"
          >
            Write a Review
          </InteractiveButton>
        )}
      </div>

      {/* Review List */}
      <ReviewList 
        reviews={reviews}
        currentUserId={currentUserId}
      />

      {/* Write Review Modal */}
      {showReviewForm && (
        <WriteReviewModal
          targetId={targetId}
          targetType={targetType}
          currentUserId={currentUserId}
          allowAnonymous={allowAnonymous}
          onClose={() => setShowReviewForm(false)}
          onSubmit={async (reviewData) => {
            await handleAsyncError(
              async () => {
                await submitReview(reviewData);
                setShowReviewForm(false);
                loadReviews();
                showToast({
                  type: 'success',
                  title: 'Review Submitted!',
                  message: 'Thank you for your feedback.',
                  duration: 4000
                });
              },
              {
                context: 'submit_review',
                severity: 'medium',
                showToUser: true
              }
            );
          }}
        />
      )}
    </FadeIn>
  );
}

// Review Statistics Component
function ReviewStats({ stats, targetType }) {
  const maxBarWidth = Math.max(...Object.values(stats.distribution));

  return (
    <div className="review-stats">
      <div className="stats-summary">
        <div className="average-rating">
          <span className="rating-number">{stats.average.toFixed(1)}</span>
          <div className="rating-stars">
            <StarRating rating={stats.average} size="large" />
          </div>
          <span className="rating-count">
            Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.distribution[rating] || 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            const barWidth = maxBarWidth > 0 ? (count / maxBarWidth) * 100 : 0;

            return (
              <div key={rating} className="distribution-bar">
                <span className="bar-label">{rating} star</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
                <span className="bar-count">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {targetType === 'product' && (
        <div className="review-highlights">
          <div className="highlight-item">
            <span className="highlight-label">Quality</span>
            <StarRating rating={4.6} size="small" />
          </div>
          <div className="highlight-item">
            <span className="highlight-label">Freshness</span>
            <StarRating rating={4.8} size="small" />
          </div>
          <div className="highlight-item">
            <span className="highlight-label">Value</span>
            <StarRating rating={4.4} size="small" />
          </div>
        </div>
      )}
    </div>
  );
}

// Review List Component
function ReviewList({ reviews, currentUserId }) {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <div className="no-reviews-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3>No Reviews Yet</h3>
        <p>Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map(review => (
        <ReviewCard 
          key={review.id}
          review={review}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

// Individual Review Card
function ReviewCard({ review, currentUserId }) {
  const [showFullText, setShowFullText] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [userFoundHelpful, setUserFoundHelpful] = useState(review.userFoundHelpful || false);
  const { showToast } = useToast();

  const isLongReview = review.comment && review.comment.length > 300;
  const displayText = showFullText || !isLongReview 
    ? review.comment 
    : review.comment.substring(0, 300) + '...';

  const handleHelpfulClick = async () => {
    try {
      const newHelpfulStatus = !userFoundHelpful;
      setUserFoundHelpful(newHelpfulStatus);
      setHelpfulCount(prev => newHelpfulStatus ? prev + 1 : prev - 1);

      await toggleHelpfulReview(review.id, newHelpfulStatus);
      
      showToast({
        type: 'success',
        title: newHelpfulStatus ? 'Marked as Helpful' : 'Removed from Helpful',
        message: 'Thank you for your feedback!',
        duration: 2000
      });
    } catch {
      // Revert optimistic update
      setUserFoundHelpful(!userFoundHelpful);
      setHelpfulCount(prev => userFoundHelpful ? prev + 1 : prev - 1);
      
      showToast({
        type: 'error',
        title: 'Action Failed',
        message: 'Unable to update helpful status'
      });
    }
  };

  return (
    <FadeIn className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <img 
            src={review.user.avatar || '/api/placeholder/48/48'} 
            alt={review.user.name}
            className="reviewer-avatar"
          />
          <div className="reviewer-details">
            <h4 className="reviewer-name">
              {review.user.name}
              {review.verified && (
                <span className="verified-badge" title="Verified Purchase">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </h4>
            <div className="review-meta">
              <StarRating rating={review.rating} size="small" />
              <span className="review-date">{formatDate(review.createdAt)}</span>
              {review.location && (
                <span className="review-location">{review.location}</span>
              )}
            </div>
          </div>
        </div>

        {currentUserId === review.user.id && (
          <div className="review-actions">
            <button className="action-button edit" title="Edit Review">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button className="action-button delete" title="Delete Review">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {review.title && (
        <h5 className="review-title">{review.title}</h5>
      )}

      <div className="review-content">
        <p className="review-text">{displayText}</p>
        
        {isLongReview && (
          <button 
            className="read-more-button"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? 'Show Less' : 'Read More'}
          </button>
        )}

        {review.images && review.images.length > 0 && (
          <div className="review-images">
            {review.images.map((image, index) => (
              <div key={index} className="review-image-container">
                <img 
                  src={image.url} 
                  alt={`Review image ${index + 1}`}
                  className="review-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="review-footer">
        <div className="review-engagement">
          <button 
            className={`helpful-button ${userFoundHelpful ? 'active' : ''}`}
            onClick={handleHelpfulClick}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Helpful ({helpfulCount})
          </button>

          <button className="reply-button">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Reply
          </button>
        </div>

        {review.merchantResponse && (
          <div className="merchant-response">
            <div className="response-header">
              <img 
                src={review.merchantResponse.avatar || '/api/placeholder/32/32'} 
                alt="Merchant"
                className="merchant-avatar"
              />
              <div className="merchant-info">
                <span className="merchant-name">{review.merchantResponse.name}</span>
                <span className="response-date">{formatDate(review.merchantResponse.date)}</span>
              </div>
            </div>
            <p className="response-text">{review.merchantResponse.message}</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// Write Review Modal
function WriteReviewModal({ 
  targetId, 
  targetType, 
  currentUserId, 
  allowAnonymous, 
  onClose, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
    anonymous: false
  });
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 5 - formData.images.length);
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            url: e.target.result,
            id: Date.now() + Math.random()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return;

    setSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        targetId,
        targetType,
        userId: currentUserId
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="write-review-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Write a Review</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          {/* Rating Selection */}
          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-star ${formData.rating >= rating ? 'selected' : ''}`}
                  onClick={() => handleRatingChange(rating)}
                  onMouseEnter={() => handleRatingChange(rating)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="rating-text">
                {formData.rating === 0 && 'Select a rating'}
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="form-group">
            <label htmlFor="review-title">Title (optional)</label>
            <input
              type="text"
              id="review-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Review Comment */}
          <div className="form-group">
            <label htmlFor="review-comment">Review *</label>
            <textarea
              id="review-comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your thoughts about this product..."
              required
              rows={5}
              maxLength={1000}
            />
            <span className="character-count">
              {formData.comment.length}/1000 characters
            </span>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Photos (optional)</label>
            <div 
              className={`image-upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="image-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                <svg className="upload-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Click to upload or drag and drop</span>
                <span className="upload-hint">Up to 5 images (JPG, PNG)</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="uploaded-images">
                {formData.images.map(image => (
                  <div key={image.id} className="uploaded-image">
                    <img src={image.url} alt="Review" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(image.id)}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          {allowAnonymous && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                />
                <span className="checkbox-text">Post anonymously</span>
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <InteractiveButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </InteractiveButton>
            <InteractiveButton
              type="submit"
              variant="primary"
              disabled={formData.rating === 0 || !formData.comment.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </InteractiveButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// Star Rating Component
function StarRating({ rating, size = 'medium', interactive = false, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (starRating) => {
    if (interactive && onChange) {
      onChange(starRating);
    }
  };

  const handleMouseEnter = (starRating) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className={`star-rating ${size} ${interactive ? 'interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            className={`star ${filled ? 'filled' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Loading Skeleton
function ReviewSystemSkeleton() {
  return (
    <div className="review-system-skeleton">
      <div className="skeleton-stats">
        <div className="skeleton-rating"></div>
        <div className="skeleton-distribution"></div>
      </div>
      <div className="skeleton-controls"></div>
      <div className="skeleton-reviews">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-review"></div>
        ))}
      </div>
    </div>
  );
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

// API Simulation Functions
async function fetchReviews(targetId, targetType, options) {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log('Fetching reviews for:', targetId, targetType, options);
  
  return [
    {
      id: 1,
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/48/48'
      },
      rating: 5,
      title: 'Excellent quality and freshness!',
      comment: 'I ordered the organic tomatoes and they were absolutely perfect. The taste was incredible - you can really tell the difference when produce is grown with care. The packaging was also excellent, everything arrived in perfect condition. Will definitely be ordering again!',
      images: [
        { url: '/api/placeholder/120/120' },
        { url: '/api/placeholder/120/120' }
      ],
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
      helpfulCount: 12,
      userFoundHelpful: false,
      location: 'San Francisco, CA',
      merchantResponse: {
        name: 'Green Valley Farm',
        avatar: '/api/placeholder/32/32',
        message: 'Thank you so much for the wonderful review, Sarah! We\'re thrilled you enjoyed our tomatoes.',
        date: '2024-01-16T09:15:00Z'
      }
    },
    {
      id: 2,
      user: {
        id: 'user2',
        name: 'Mike Chen',
        avatar: '/api/placeholder/48/48'
      },
      rating: 4,
      title: 'Great produce, fast delivery',
      comment: 'Really happy with the quality of the vegetables. Everything was fresh and well-packaged. Delivery was faster than expected. Only minor issue was that one item was slightly smaller than expected, but overall very satisfied.',
      verified: true,
      createdAt: '2024-01-12T14:20:00Z',
      helpfulCount: 8,
      userFoundHelpful: true,
      location: 'Oakland, CA'
    },
    {
      id: 3,
      user: {
        id: 'user3',
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/48/48'
      },
      rating: 5,
      comment: 'This is my third order and I\'m consistently impressed with the quality. The farmer clearly takes great care in growing and selecting their produce. The customer service is also excellent - they always respond quickly to any questions.',
      verified: true,
      createdAt: '2024-01-10T16:45:00Z',
      helpfulCount: 15,
      userFoundHelpful: false,
      location: 'Berkeley, CA'
    }
  ];
}

async function fetchReviewStats(targetId, targetType) {
  await new Promise(resolve => setTimeout(resolve, 600));
  console.log('Fetching review stats for:', targetId, targetType);
  
  return {
    average: 4.6,
    total: 47,
    distribution: {
      5: 28,
      4: 12,
      3: 5,
      2: 1,
      1: 1
    }
  };
}

async function submitReview(reviewData) {
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log('Submitting review:', reviewData);
  return { success: true, id: Date.now() };
}

async function toggleHelpfulReview(reviewId, helpful) {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Toggling helpful for review:', reviewId, helpful);
  return { success: true };
}

export default ReviewSystem;
export { StarRating };