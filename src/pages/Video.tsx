import React from "react";

const Video = () => {
  return (
    <div
      style={{
        width: "550px",
        height: "250px",
        overflow: "hidden",
      }}
    >
      <iframe
        width="550"
        height="314"
        src="https://firebasestorage.googleapis.com/v0/b/winuwatch-bd56d.appspot.com/o/professional-watches-cosmograph-daytona-cover-video_portrait.mp4?alt=media&token=20426bb0-5cee-4a37-8273-6b4fae3f0e95"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Video;
