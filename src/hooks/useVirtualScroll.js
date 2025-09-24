import { useState, useMemo } from 'react';

// Hook for virtual scrolling with dynamic item heights
export const useVirtualScroll = ({
  items,
  containerHeight,
  estimatedItemHeight = 50,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState(new Map());

  // Calculate cumulative offsets
  const calculateOffsets = useMemo(() => {
    let offset = 0;
    const offsets = new Map();

    items.forEach((item, index) => {
      offsets.set(index, offset);
      const height = itemHeights.get(index) || estimatedItemHeight;
      offset += height;
    });

    return offsets;
  }, [items, itemHeights, estimatedItemHeight]);

  // Find visible range for dynamic heights
  const getVisibleRange = useMemo(() => {
    const offsets = Array.from(calculateOffsets.entries());
    
    const startIndex = offsets.findIndex(([, offset]) => offset + estimatedItemHeight >= scrollTop);
    const start = Math.max(0, startIndex - overscan);
    
    let end = start;
    let currentOffset = calculateOffsets.get(start) || 0;
    
    while (end < items.length && currentOffset < scrollTop + containerHeight + overscan * estimatedItemHeight) {
      const height = itemHeights.get(end) || estimatedItemHeight;
      currentOffset += height;
      end++;
    }
    
    return { 
      start, 
      end: Math.min(items.length - 1, end + overscan),
      totalHeight: currentOffset
    };
  }, [scrollTop, containerHeight, calculateOffsets, itemHeights, items.length, estimatedItemHeight, overscan]);

  const measureItem = (index, height) => {
    setItemHeights(prev => new Map(prev).set(index, height));
  };

  return {
    ...getVisibleRange,
    scrollTop,
    setScrollTop,
    measureItem,
    itemOffsets: calculateOffsets,
  };
};