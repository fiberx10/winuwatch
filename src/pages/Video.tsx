import React from "react";

const Video = () => {
  return (
    <div
      style={{
        height: "50vh",
      }}
    >
      <video width="100%" height="100%" autoPlay loop playsInline muted={true}>
        <source
          src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.webm"
          type="video/webm"
        />
      </video>
    </div>
  );
};

export default Video;
