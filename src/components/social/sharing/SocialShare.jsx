import React, { useState, useCallback } from 'react';
import { useToast } from '../../../hooks/useToast';
import './SocialShare.css';

const SocialShare = ({ 
  url, 
  title, 
  description, 
  image,
  hashtags = [],
  showLabel = true,
  size = 'medium', // small, medium, large
  layout = 'horizontal' // horizontal, vertical, grid
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { showToast } = useToast();

  // Social media share URLs
  const getShareUrls = useCallback(() => {
    const shareData = {
      url: encodeURIComponent(url || window.location.href),
      title: encodeURIComponent(title || document.title),
      description: encodeURIComponent(description || ''),
      hashtags: hashtags.join(',')
    };

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&hashtags=${shareData.hashtags}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
      whatsapp: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      telegram: `https://t.me/share/url?url=${shareData.url}&text=${shareData.title}`,
      reddit: `https://reddit.com/submit?url=${shareData.url}&title=${shareData.title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${shareData.url}&description=${shareData.title}${image ? `&media=${encodeURIComponent(image)}` : ''}`,
      email: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`
    };
  }, [url, title, description, image, hashtags]);

  const handleShare = useCallback(async (platform) => {
    const shareUrls = getShareUrls();
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: description || '',
          url: url || window.location.href
        });
        showToast('Shared successfully!', 'success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          showToast('Failed to share', 'error');
        }
      }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopySuccess(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url || window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopySuccess(true);
          showToast('Link copied to clipboard!', 'success');
          setTimeout(() => setCopySuccess(false), 2000);
        } catch {
          showToast('Failed to copy link', 'error');
        }
        document.body.removeChild(textArea);
      }
    } else {
      const shareUrl = shareUrls[platform];
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      }
    }
    
    setShowShareMenu(false);
  }, [url, title, description, showToast, getShareUrls]);

  const socialPlatforms = [
    {
      name: 'facebook',
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      color: '#1DA1F2'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: '#0077B5'
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
        </svg>
      ),
      color: '#25D366'
    },
    {
      name: 'telegram',
      label: 'Telegram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: '#0088CC'
    },
    {
      name: 'reddit',
      label: 'Reddit',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.246.561 1.246 1.249a1.245 1.245 0 0 1-1.246 1.249c-.688 0-1.246-.561-1.246-1.249 0-.688.558-1.249 1.246-1.249zm-5.01 3.473c2.886 0 5.396 1.082 6.459 2.564.364.508.114 1.18-.499 1.18-.416 0-.775-.242-.965-.589-.451-.821-1.706-1.514-2.995-1.514s-2.544.693-2.995 1.514c-.19.347-.549.589-.965.589-.613 0-.863-.672-.499-1.18C6.614 9.299 9.124 8.217 12.01 8.217zM8.5 11.5c.688 0 1.246.561 1.246 1.249 0 .688-.558 1.249-1.246 1.249-.688 0-1.246-.561-1.246-1.249 0-.688.558-1.249 1.246-1.249zm7 0c.688 0 1.246.561 1.246 1.249 0 .688-.558 1.249-1.246 1.249-.688 0-1.246-.561-1.246-1.249 0-.688.558-1.249 1.246-1.249zm-7 4.5c.688 0 1.246.561 1.246 1.249 0 .688-.558 1.249-1.246 1.249-.688 0-1.246-.561-1.246-1.249 0-.688.558-1.249 1.246-1.249zm7 0c.688 0 1.246.561 1.246 1.249 0 .688-.558 1.249-1.246 1.249-.688 0-1.246-.561-1.246-1.249 0-.688.558-1.249 1.246-1.249z"/>
        </svg>
      ),
      color: '#FF4500'
    },
    {
      name: 'pinterest',
      label: 'Pinterest',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      ),
      color: '#E60023'
    },
    {
      name: 'email',
      label: 'Email',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      color: '#6B7280'
    },
    {
      name: 'copy',
      label: copySuccess ? 'Copied!' : 'Copy Link',
      icon: copySuccess ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      ),
      color: copySuccess ? '#10B981' : '#6B7280'
    }
  ];

  // Check if native sharing is available
  const nativeShareAvailable = navigator.share && navigator.canShare;

  return (
    <div className={`social-share ${size} ${layout}`}>
      {nativeShareAvailable ? (
        <button
          className="share-button native-share"
          onClick={() => handleShare('native')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
          {showLabel && <span>Share</span>}
        </button>
      ) : (
        <div className="share-container">
          <button
            className="share-button trigger"
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-expanded={showShareMenu}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            {showLabel && <span>Share</span>}
          </button>

          {showShareMenu && (
            <>
              <div 
                className="share-overlay"
                onClick={() => setShowShareMenu(false)}
              />
              <div className="share-menu">
                <div className="share-menu-header">
                  <h3>Share this content</h3>
                  <button
                    className="close-menu"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
                <div className="share-platforms">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      className={`platform-button ${platform.name} ${copySuccess && platform.name === 'copy' ? 'success' : ''}`}
                      onClick={() => handleShare(platform.name)}
                      style={{ '--platform-color': platform.color }}
                    >
                      <div className="platform-icon">
                        {platform.icon}
                      </div>
                      <span className="platform-label">{platform.label}</span>
                    </button>
                  ))}
                </div>
                {url && (
                  <div className="share-url">
                    <label htmlFor="share-url-input">Share URL:</label>
                    <div className="url-input-container">
                      <input
                        id="share-url-input"
                        type="text"
                        value={url}
                        readOnly
                        className="url-input"
                      />
                      <button
                        className="copy-url-button"
                        onClick={() => handleShare('copy')}
                      >
                        {copySuccess ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialShare;