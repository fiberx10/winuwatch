import styles from "@/styles/Home.module.css";

const Video = () => {
  return (
    <div className={styles.vid}>
      <div className={styles.headerback}></div>
      <video width="100%" height="100%" autoPlay loop playsInline muted={true}>
        {/* <source
            src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.webm"
            type="video/webm"
          /> */}
        {/* <source
          src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.mp4"
          type="video/mp4"
        /> */}
        <source
          src="/images/professional-watches-cosmograph-daytona-cover-video_portrait.mov"
          type="video/quicktime"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
