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
        style={style || { maxWidth: '100%' , display: 'none', position: 'absolute', bottom: '-10000px' }}
      />
    );
  }
);

VideoDisplay.displayName = 'VideoDisplay';