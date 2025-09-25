// Simple Virtual Scroll List Component
import React from 'react';
import './VirtualScrollList.css';

const VirtualScrollList = ({ 
  items, 
  renderItem, 
  itemHeight = 200,
  containerHeight = 600,
  className = '',
  ...props 
}) => {
  // Simplified version - just render all items for now
  return (
    <div 
      className={`virtual-scroll-list ${className}`}
      style={{ height: containerHeight }}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} style={{ minHeight: itemHeight }}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default VirtualScrollList;