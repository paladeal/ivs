import React, { forwardRef } from 'react';

interface DetectionCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DetectionCanvas = forwardRef<HTMLCanvasElement, DetectionCanvasProps>(
  ({ className, style }, ref) => {
    return (
      <canvas
        ref={ref}
        className={className || "absolute top-0 left-0 pointer-events-none"}
        style={style || { maxWidth: '100%' }}
      />
    );
  }
);

DetectionCanvas.displayName = 'DetectionCanvas';