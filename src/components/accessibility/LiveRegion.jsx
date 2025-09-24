import React, { useState, useRef, useEffect } from 'react';

/**
 * LiveRegion - Announces dynamic content changes to screen readers
 * Essential for accessibility announcements (WCAG 2.1)
 */
const LiveRegion = ({ 
  message = '', 
  politeness = 'polite', // 'polite' | 'assertive' | 'off'
  clearOnUnmount = true,
  clearDelay = 1000,
  className = 'sr-only'
}) => {
  const [announcements, setAnnouncements] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (message && message.trim()) {
      const id = Date.now();
      const newAnnouncement = { id, message: message.trim() };
      
      setAnnouncements(prev => [...prev, newAnnouncement]);

      // Clear the message after delay
      if (clearDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        }, clearDelay);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearDelay]);

  useEffect(() => {
    return () => {
      if (clearOnUnmount) {
        setAnnouncements([]);
      }
    };
  }, [clearOnUnmount]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={className}
      role="status"
    >
      {announcements.map(announcement => (
        <div key={announcement.id}>
          {announcement.message}
        </div>
      ))}
    </div>
  );
};

export default LiveRegion;