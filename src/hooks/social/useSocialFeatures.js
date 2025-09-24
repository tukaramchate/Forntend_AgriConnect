import { useState, useCallback, useEffect } from 'react';
import { useErrorHandler } from '../../useErrorHandler';
import { useToast } from '../../useToast';

/**
 * Custom hook for social features like following, liking, bookmarking
 */
export const useSocialActions = (initialData = {}) => {
  const [socialState, setSocialState] = useState({
    following: initialData.following || [],
    likedItems: initialData.likedItems || [],
    bookmarkedItems: initialData.bookmarkedItems || [],
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { showToast } = useToast();

  // Follow/Unfollow a user
  const toggleFollow = useCallback(
    async (userId, userType = 'farmer') => {
      const isFollowing = socialState.following.includes(userId);

      try {
        setLoading(true);

        // Optimistic update
        setSocialState((prev) => ({
          ...prev,
          following: isFollowing
            ? prev.following.filter((id) => id !== userId)
            : [...prev.following, userId],
        }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        showToast(
          isFollowing ? `Unfollowed ${userType}` : `Following ${userType}`,
          'success'
        );

        return !isFollowing;
      } catch (error) {
        // Revert optimistic update
        setSocialState((prev) => ({
          ...prev,
          following: isFollowing
            ? [...prev.following, userId]
            : prev.following.filter((id) => id !== userId),
        }));

        handleError(
          error,
          `Failed to ${isFollowing ? 'unfollow' : 'follow'} ${userType}`
        );
        return isFollowing;
      } finally {
        setLoading(false);
      }
    },
    [socialState.following, handleError, showToast]
  );

  // Like/Unlike an item (post, product, etc.)
  const toggleLike = useCallback(
    async (itemId, itemType = 'post') => {
      const isLiked = socialState.likedItems.includes(itemId);

      try {
        // Optimistic update
        setSocialState((prev) => ({
          ...prev,
          likedItems: isLiked
            ? prev.likedItems.filter((id) => id !== itemId)
            : [...prev.likedItems, itemId],
        }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        return !isLiked;
      } catch (error) {
        // Revert optimistic update
        setSocialState((prev) => ({
          ...prev,
          likedItems: isLiked
            ? [...prev.likedItems, itemId]
            : prev.likedItems.filter((id) => id !== itemId),
        }));

        handleError(
          error,
          `Failed to ${isLiked ? 'unlike' : 'like'} ${itemType}`
        );
        return isLiked;
      }
    },
    [socialState.likedItems, handleError]
  );

  // Bookmark/Unbookmark an item
  const toggleBookmark = useCallback(
    async (itemId) => {
      const isBookmarked = socialState.bookmarkedItems.includes(itemId);

      try {
        // Optimistic update
        setSocialState((prev) => ({
          ...prev,
          bookmarkedItems: isBookmarked
            ? prev.bookmarkedItems.filter((id) => id !== itemId)
            : [...prev.bookmarkedItems, itemId],
        }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        showToast(
          isBookmarked ? `Removed from bookmarks` : `Added to bookmarks`,
          'success'
        );

        return !isBookmarked;
      } catch (error) {
        // Revert optimistic update
        setSocialState((prev) => ({
          ...prev,
          bookmarkedItems: isBookmarked
            ? [...prev.bookmarkedItems, itemId]
            : prev.bookmarkedItems.filter((id) => id !== itemId),
        }));

        handleError(
          error,
          `Failed to ${isBookmarked ? 'remove from' : 'add to'} bookmarks`
        );
        return isBookmarked;
      }
    },
    [socialState.bookmarkedItems, handleError, showToast]
  );

  // Check if user is following
  const isFollowing = useCallback(
    (userId) => {
      return socialState.following.includes(userId);
    },
    [socialState.following]
  );

  // Check if item is liked
  const isLiked = useCallback(
    (itemId) => {
      return socialState.likedItems.includes(itemId);
    },
    [socialState.likedItems]
  );

  // Check if item is bookmarked
  const isBookmarked = useCallback(
    (itemId) => {
      return socialState.bookmarkedItems.includes(itemId);
    },
    [socialState.bookmarkedItems]
  );

  // Get following count
  const getFollowingCount = useCallback(() => {
    return socialState.following.length;
  }, [socialState.following.length]);

  // Get likes count
  const getLikesCount = useCallback(() => {
    return socialState.likedItems.length;
  }, [socialState.likedItems.length]);

  // Get bookmarks count
  const getBookmarksCount = useCallback(() => {
    return socialState.bookmarkedItems.length;
  }, [socialState.bookmarkedItems.length]);

  // Bulk update social state (useful for initial data loading)
  const updateSocialState = useCallback((newState) => {
    setSocialState((prev) => ({ ...prev, ...newState }));
  }, []);

  // Reset social state
  const resetSocialState = useCallback(() => {
    setSocialState({
      following: [],
      likedItems: [],
      bookmarkedItems: [],
    });
  }, []);

  return {
    // State
    socialState,
    loading,

    // Actions
    toggleFollow,
    toggleLike,
    toggleBookmark,

    // Checkers
    isFollowing,
    isLiked,
    isBookmarked,

    // Counters
    getFollowingCount,
    getLikesCount,
    getBookmarksCount,

    // Utilities
    updateSocialState,
    resetSocialState,
  };
};

/**
 * Custom hook for managing social sharing
 */
export const useSocialShare = () => {
  const { showToast } = useToast();
  const { handleError } = useErrorHandler();

  const shareContent = useCallback(
    async (platform, shareData) => {
      const {
        url = window.location.href,
        title = document.title,
        description = '',
        image = '',
        hashtags = [],
      } = shareData;

      try {
        if (platform === 'native' && navigator.share) {
          await navigator.share({
            title,
            text: description,
            url,
          });
          showToast('Shared successfully!', 'success');
          return true;
        }

        if (platform === 'copy') {
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!', 'success');
          return true;
        }

        // Generate platform-specific share URLs
        const shareUrls = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags.join(',')}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
          telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}${image ? `&media=${encodeURIComponent(image)}` : ''}`,
          email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}%0A%0A${encodeURIComponent(url)}`,
        };

        const shareUrl = shareUrls[platform];
        if (shareUrl) {
          window.open(
            shareUrl,
            '_blank',
            'width=600,height=400,scrollbars=yes,resizable=yes'
          );
          return true;
        }

        throw new Error(`Unsupported platform: ${platform}`);
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleError(error, 'Failed to share content');
        }
        return false;
      }
    },
    [showToast, handleError]
  );

  const canUseNativeShare = useCallback((shareData = {}) => {
    return (
      navigator.share && navigator.canShare && navigator.canShare(shareData)
    );
  }, []);

  return {
    shareContent,
    canUseNativeShare,
  };
};

/**
 * Custom hook for managing community interactions
 */
export const useCommunityInteractions = () => {
  const [interactions, setInteractions] = useState({
    posts: [],
    comments: [],
    reactions: [],
  });

  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { showToast } = useToast();

  // Create a new post
  const createPost = useCallback(
    async (postData) => {
      try {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newPost = {
          id: Date.now(),
          ...postData,
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,
        };

        setInteractions((prev) => ({
          ...prev,
          posts: [newPost, ...prev.posts],
        }));

        showToast('Post created successfully!', 'success');
        return newPost;
      } catch (error) {
        handleError(error, 'Failed to create post');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, showToast]
  );

  // Add a comment to a post
  const addComment = useCallback(
    async (postId, commentData) => {
      try {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newComment = {
          id: Date.now(),
          postId,
          ...commentData,
          timestamp: new Date().toISOString(),
          likes: 0,
        };

        setInteractions((prev) => ({
          ...prev,
          comments: [...prev.comments, newComment],
          posts: prev.posts.map((post) =>
            post.id === postId ? { ...post, comments: post.comments + 1 } : post
          ),
        }));

        showToast('Comment added!', 'success');
        return newComment;
      } catch (error) {
        handleError(error, 'Failed to add comment');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, showToast]
  );

  // React to content (like, helpful, etc.)
  const addReaction = useCallback(
    async (targetId, targetType, reactionType) => {
      try {
        const existingReaction = interactions.reactions.find(
          (r) =>
            r.targetId === targetId &&
            r.targetType === targetType &&
            r.type === reactionType
        );

        if (existingReaction) {
          // Remove reaction
          setInteractions((prev) => ({
            ...prev,
            reactions: prev.reactions.filter(
              (r) => r.id !== existingReaction.id
            ),
          }));
        } else {
          // Add reaction
          const newReaction = {
            id: Date.now(),
            targetId,
            targetType,
            type: reactionType,
            timestamp: new Date().toISOString(),
          };

          setInteractions((prev) => ({
            ...prev,
            reactions: [...prev.reactions, newReaction],
          }));
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        return !existingReaction;
      } catch (error) {
        handleError(error, 'Failed to update reaction');
        throw error;
      }
    },
    [interactions.reactions, handleError]
  );

  // Get reactions for a specific target
  const getReactions = useCallback(
    (targetId, targetType) => {
      return interactions.reactions.filter(
        (r) => r.targetId === targetId && r.targetType === targetType
      );
    },
    [interactions.reactions]
  );

  // Check if user has reacted to content
  const hasReacted = useCallback(
    (targetId, targetType, reactionType) => {
      return interactions.reactions.some(
        (r) =>
          r.targetId === targetId &&
          r.targetType === targetType &&
          r.type === reactionType
      );
    },
    [interactions.reactions]
  );

  // Get comments for a post
  const getPostComments = useCallback(
    (postId) => {
      return interactions.comments.filter((c) => c.postId === postId);
    },
    [interactions.comments]
  );

  return {
    // State
    interactions,
    loading,

    // Actions
    createPost,
    addComment,
    addReaction,

    // Getters
    getReactions,
    hasReacted,
    getPostComments,
  };
};

/**
 * Custom hook for managing user reputation and social metrics
 */
export const useSocialMetrics = (userId) => {
  const [metrics, setMetrics] = useState({
    reputation: 0,
    followers: 0,
    following: 0,
    posts: 0,
    likes: 0,
    comments: 0,
    helpfulVotes: 0,
    badges: [],
  });

  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  // Fetch user metrics
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock metrics data
      const mockMetrics = {
        reputation: Math.floor(Math.random() * 5000) + 100,
        followers: Math.floor(Math.random() * 1000) + 50,
        following: Math.floor(Math.random() * 500) + 20,
        posts: Math.floor(Math.random() * 200) + 10,
        likes: Math.floor(Math.random() * 2000) + 100,
        comments: Math.floor(Math.random() * 500) + 50,
        helpfulVotes: Math.floor(Math.random() * 300) + 25,
        badges: [
          { id: 1, name: 'Verified Farmer', icon: '✓', color: '#10b981' },
          { id: 2, name: 'Top Contributor', icon: '⭐', color: '#f59e0b' },
          { id: 3, name: 'Helper', icon: '🤝', color: '#6366f1' },
        ],
      };

      setMetrics(mockMetrics);
    } catch (error) {
      handleError(error, 'Failed to load user metrics');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Calculate reputation level
  const getReputationLevel = useCallback(() => {
    const { reputation } = metrics;
    if (reputation < 100) return { level: 'Newcomer', color: '#9ca3af' };
    if (reputation < 500) return { level: 'Active', color: '#3b82f6' };
    if (reputation < 1000) return { level: 'Contributor', color: '#10b981' };
    if (reputation < 2500) return { level: 'Expert', color: '#f59e0b' };
    return { level: 'Master', color: '#8b5cf6' };
  }, [metrics]);

  // Get engagement rate
  const getEngagementRate = useCallback(() => {
    const { posts, likes, comments } = metrics;
    if (posts === 0) return 0;
    return Math.round(((likes + comments) / posts) * 100) / 100;
  }, [metrics]);

  useEffect(() => {
    if (userId) {
      fetchMetrics();
    }
  }, [userId, fetchMetrics]);

  return {
    metrics,
    loading,
    getReputationLevel,
    getEngagementRate,
    refetchMetrics: fetchMetrics,
  };
};
