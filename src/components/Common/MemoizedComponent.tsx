import React, { memo } from 'react';

interface MemoizedComponentProps {
  children: React.ReactNode;
  dependencies?: any[];
}

export const MemoizedComponent: React.FC<MemoizedComponentProps> = memo(
  ({ children }) => {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // Custom comparison logic
    if (prevProps.dependencies && nextProps.dependencies) {
      return prevProps.dependencies.every(
        (dep, index) => dep === nextProps.dependencies![index]
      );
    }
    return false;
  }
);