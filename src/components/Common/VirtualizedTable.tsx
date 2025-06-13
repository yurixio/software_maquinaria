import React, { useRef, useCallback } from 'react';
import { useVirtualization } from '../../hooks/useVirtualization';

interface VirtualizedTableProps<T> {
  data: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedTable = <T,>({
  data,
  itemHeight,
  containerHeight,
  renderItem,
  className = ''
}: VirtualizedTableProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    startIndex
  } = useVirtualization(data, {
    itemHeight,
    containerHeight
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};