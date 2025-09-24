import React, { useState, useEffect, useCallback } from 'react';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useToast } from '../../../hooks/useToast';
import './CommunityFeed.css';

const CommunityFeed = ({ farmerId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState('all'); // all, following, trending
  const [submittingPost, setSubmittingPost] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  
  const { handleError } = useErrorHandler();
  const { showToast } = useToast();

  // Simulate API calls
  const fetchPosts = useCallback(async (filterType = 'all') => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock community posts data
      const mockPosts = [
        {
          id: 1,
          author: {
            id: 101,
            name: 'John Smith',
            avatar: '/api/placeholder/40/40',
            role: 'Organic Farmer',
            verified: true,
            location: 'California, USA'
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          content: 'Just harvested the most amazing tomatoes from our greenhouse! The new hydroponic system is working wonders. Here are some tips for anyone interested in starting their own hydroponic setup...',
          images: [
            '/api/placeholder/400/300',
            '/api/placeholder/400/300',
            '/api/placeholder/400/300'
          ],
          likes: 45,
          comments: 12,
          shares: 8,
          tags: ['hydroponics', 'tomatoes', 'organic', 'greenhouse'],
          liked: false,
          bookmarked: false,
          type: 'success_story'
        },
        {
          id: 2,
          author: {
            id: 102,
            name: 'Maria Rodriguez',
            avatar: '/api/placeholder/40/40',
            role: 'Agricultural Expert',
            verified: true,
            location: 'Texas, USA'
          },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          content: 'Weather alert: Heavy rains expected in the southwestern regions this week. Make sure to protect your crops and check drainage systems. Here\'s a quick checklist for storm preparation.',
          images: [],
          likes: 67,
          comments: 23,
          shares: 34,
          tags: ['weather', 'alert', 'storm_prep', 'safety'],
          liked: true,
          bookmarked: true,
          type: 'alert'
        },
        {
          id: 3,
          author: {
            id: 103,
            name: 'David Chen',
            avatar: '/api/placeholder/40/40',
            role: 'Tech Farmer',
            verified: false,
            location: 'Oregon, USA'
          },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          content: 'Has anyone tried the new soil sensors from TechFarm? I\'m considering investing in some IoT equipment for my corn fields.',
          images: ['/api/placeholder/400/300'],
          likes: 23,
          comments: 15,
          shares: 3,
          tags: ['technology', 'iot', 'sensors', 'corn'],
          liked: false,
          bookmarked: false,
          type: 'question'
        },
        {
          id: 4,
          author: {
            id: 104,
            name: 'Sarah Johnson',
            avatar: '/api/placeholder/40/40',
            role: 'Sustainability Advocate',
            verified: true,
            location: 'Vermont, USA'
          },
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          content: 'Excited to share our farm\'s carbon footprint report! We\'ve reduced emissions by 30% this year through regenerative practices. Happy to answer questions about our methods.',
          images: [
            '/api/placeholder/400/300',
            '/api/placeholder/400/300'
          ],
          likes: 89,
          comments: 28,
          shares: 15,
          tags: ['sustainability', 'carbon_neutral', 'regenerative', 'environment'],
          liked: false,
          bookmarked: true,
          type: 'achievement'
        }
      ];

      // Filter posts based on selected filter
      let filteredPosts = mockPosts;
      if (filterType === 'trending') {
        filteredPosts = mockPosts.filter(post => post.likes > 50);
      } else if (filterType === 'following') {
        filteredPosts = mockPosts.filter(post => post.author.verified);
      }

      setPosts(filteredPosts);
    } catch (error) {
      handleError(error, 'Failed to load community posts');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const handleCreatePost = useCallback(async () => {
    if (!newPostText.trim()) {
      showToast('Please enter some content for your post', 'warning');
      return;
    }

    try {
      setSubmittingPost(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPost = {
        id: Date.now(),
        author: {
          id: farmerId || 999,
          name: 'You',
          avatar: '/api/placeholder/40/40',
          role: 'Farmer',
          verified: false,
          location: 'Your Location'
        },
        timestamp: new Date().toISOString(),
        content: newPostText,
        images: newPostImages,
        likes: 0,
        comments: 0,
        shares: 0,
        tags: extractTags(newPostText),
        liked: false,
        bookmarked: false,
        type: 'general'
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostText('');
      setNewPostImages([]);
      setShowCreatePost(false);
      showToast('Post created successfully!', 'success');
    } catch (error) {
      handleError(error, 'Failed to create post');
    } finally {
      setSubmittingPost(false);
    }
  }, [newPostText, newPostImages, farmerId, handleError, showToast]);

  const handleLikePost = useCallback(async (postId) => {
    try {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      handleError(error, 'Failed to update like');
      // Revert optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                liked: !post.liked,
                likes: post.liked ? post.likes + 1 : post.likes - 1
              }
            : post
        )
      );
    }
  }, [handleError]);

  const handleBookmarkPost = useCallback(async (postId) => {
    try {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, bookmarked: !post.bookmarked }
            : post
        )
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const post = posts.find(p => p.id === postId);
      showToast(
        post?.bookmarked ? 'Post removed from bookmarks' : 'Post bookmarked!',
        'success'
      );
    } catch (error) {
      handleError(error, 'Failed to update bookmark');
      // Revert optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, bookmarked: !post.bookmarked }
            : post
        )
      );
    }
  }, [posts, handleError, showToast]);

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewPostImages(prev => [...prev, ...imageUrls].slice(0, 5)); // Max 5 images
  }, []);

  const removeImage = useCallback((index) => {
    setNewPostImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleExpandPost = useCallback((postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const extractTags = (text) => {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.substring(1).toLowerCase());
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'success_story':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'alert':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      case 'question':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        );
      case 'achievement':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchPosts(filter);
  }, [fetchPosts, filter]);

  if (loading) {
    return (
      <div className="community-feed">
        <div className="feed-skeleton">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="post-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-content"></div>
              <div className="skeleton-actions"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="community-feed">
      {/* Feed Header */}
      <div className="feed-header">
        <h2>Community Feed</h2>
        <div className="feed-filters">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button
            className={`filter-button ${filter === 'following' ? 'active' : ''}`}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
          <button
            className={`filter-button ${filter === 'trending' ? 'active' : ''}`}
            onClick={() => setFilter('trending')}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Create Post */}
      <div className="create-post-container">
        {!showCreatePost ? (
          <button
            className="create-post-trigger"
            onClick={() => setShowCreatePost(true)}
          >
            <div className="trigger-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span>What's happening on your farm?</span>
          </button>
        ) : (
          <div className="create-post-form">
            <div className="form-header">
              <h3>Create Post</h3>
              <button
                className="close-form"
                onClick={() => setShowCreatePost(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share your farming insights, ask questions, or celebrate your successes..."
              className="post-textarea"
              maxLength={1000}
            />
            <div className="character-count">
              {newPostText.length}/1000
            </div>
            
            {newPostImages.length > 0 && (
              <div className="post-images-preview">
                {newPostImages.map((image, index) => (
                  <div key={index} className="preview-image">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      className="remove-preview-image"
                      onClick={() => removeImage(index)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <div className="post-options">
                <label className="image-upload-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <span>Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="submit-actions">
                <button
                  className="cancel-post"
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-post"
                  onClick={handleCreatePost}
                  disabled={submittingPost || !newPostText.trim()}
                >
                  {submittingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.id} className={`post-card ${post.type}`}>
            {/* Post Header */}
            <div className="post-header">
              <div className="author-info">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="author-avatar"
                />
                <div className="author-details">
                  <div className="author-name">
                    {post.author.name}
                    {post.author.verified && (
                      <span className="verified-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="post-meta">
                    <span className="author-role">{post.author.role}</span>
                    <span className="separator">•</span>
                    <span className="location">{post.author.location}</span>
                    <span className="separator">•</span>
                    <span className="timestamp">{getTimeAgo(post.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="post-type-indicator">
                {getPostTypeIcon(post.type)}
              </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <div className="post-text">
                {expandedPosts.has(post.id) || post.content.length <= 200 ? (
                  <p>{post.content}</p>
                ) : (
                  <>
                    <p>{post.content.substring(0, 200)}...</p>
                    <button
                      className="read-more"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      Read more
                    </button>
                  </>
                )}
                {expandedPosts.has(post.id) && post.content.length > 200 && (
                  <button
                    className="read-less"
                    onClick={() => toggleExpandPost(post.id)}
                  >
                    Show less
                  </button>
                )}
              </div>

              {post.images.length > 0 && (
                <div className={`post-images ${post.images.length > 1 ? 'multiple' : ''}`}>
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="post-image"
                    />
                  ))}
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <div className="action-stats">
                <span className="stat">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {post.likes}
                </span>
                <span className="stat">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 6h-2l-9-4-9 4v2h2l9 4 9-4V6zM12 16l-9-4h2l7 3 7-3h2l-9 4z"/>
                  </svg>
                  {post.comments}
                </span>
                <span className="stat">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  {post.shares}
                </span>
              </div>
              <div className="action-buttons">
                <button
                  className={`action-button like ${post.liked ? 'active' : ''}`}
                  onClick={() => handleLikePost(post.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Like
                </button>
                <button className="action-button comment">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 6h-2l-9-4-9 4v2h2l9 4 9-4V6zM12 16l-9-4h2l7 3 7-3h2l-9 4z"/>
                  </svg>
                  Comment
                </button>
                <button className="action-button share">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  Share
                </button>
                <button
                  className={`action-button bookmark ${post.bookmarked ? 'active' : ''}`}
                  onClick={() => handleBookmarkPost(post.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-feed">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3>No posts yet</h3>
          <p>Be the first to share something with the community!</p>
          <button
            className="create-first-post"
            onClick={() => setShowCreatePost(true)}
          >
            Create Post
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;