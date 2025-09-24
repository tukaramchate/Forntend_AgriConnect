import React, { useState, useEffect, useRef, useMemo } from 'react';
import { throttle } from '../utils/performance';
import './VirtualScrollList.css';

const VirtualScrollList = ({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8,
  loading = false,
  emptyState = null,

  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRect, setContainerRect] = useState({ width: 0, height: containerHeight });
  const containerRef = useRef(null);
  const scrollElementRef = useRef(null);

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    if (!items.length) return { start: 0, end: 0 };

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerRect.height / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);

    return { start, end };
  }, [scrollTop, itemHeight, containerRect.height, items.length, overscan]);

  // Create throttled scroll handler
  const handleScroll = useMemo(
    () =>
      throttle((e) => {
        const newScrollTop = e.target.scrollTop;
        setScrollTop(newScrollTop);

        // Check if we need to load more items
        if (onEndReached) {
          const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = e.target;
          const scrollPercentage = (currentScrollTop + clientHeight) / scrollHeight;
          
          if (scrollPercentage >= endReachedThreshold && !loading) {
            onEndReached();
          }
        }
      }, 16), // ~60fps
    [onEndReached, endReachedThreshold, loading]
  );

  // Update container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerRect({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(throttle(updateDimensions, 100));
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate total height and visible items
  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);
  const offsetY = visibleRange.start * itemHeight;

  // Empty state
  if (!items.length && !loading) {
    return (
      <div className={`virtual-scroll-list empty ${className}`} {...props}>
        {emptyState || (
          <div className="empty-state">
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-list ${className}`}
      style={{ height: containerHeight }}
      {...props}
    >
      <div
        ref={scrollElementRef}
        className="virtual-scroll-content"
        style={{ height: totalHeight }}
        onScroll={handleScroll}
      >
        <div
          className="virtual-scroll-items"
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'relative',
          }}
        >
          {visibleItems.map((item, index) => {
            const itemIndex = visibleRange.start + index;
            return (
              <div
                key={item.id || itemIndex}
                className="virtual-scroll-item"
                style={{
                  height: itemHeight,
                  position: 'relative',
                }}
              >
                {renderItem(item, itemIndex)}
              </div>
            );
          })}
        </div>
        
        {loading && (
          <div className="virtual-scroll-loading">
            <div className="loading-spinner"></div>
            <span>Loading more items...</span>
          </div>
        )}
      </div>
    </div>
  );
};



// Performance optimized list item wrapper
export const VirtualListItem = ({ 
  children, 
  index, 
  onHeightChange, 
  style = {},
  ...props 
}) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current && onHeightChange) {
      const height = itemRef.current.getBoundingClientRect().height;
      onHeightChange(index, height);
    }
  }, [index, onHeightChange, children]);

  return (
    <div
      ref={itemRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default VirtualScrollList;