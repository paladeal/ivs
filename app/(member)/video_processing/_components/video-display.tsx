import React, { forwardRef } from 'react';

interface VideoDisplayProps {
  className?: string;
  style?: React.CSSProperties;
}

export const VideoDisplay = forwardRef<HTMLVideoElement, VideoDisplayProps>(
  ({ className, style }, ref) => {
    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        className={className || "border border-gray-300"}
        style={style || { maxWidth: '100%' }}
      />
    );
  }
);

VideoDisplay.displayName = 'VideoDisplay';