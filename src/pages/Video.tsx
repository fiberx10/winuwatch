import styles from "@/styles/Home.module.css";
import { useState } from "react";

const Video = () => {
  const [muted, setMuted] = useState(true);

  return (
    <div className={styles.vid}>
      <div className={styles.headerback}></div>
      <video width="100%" height="100%" autoPlay loop playsInline muted={muted}>
        <source
          src="https://firebasestorage.googleapis.com/v0/b/winuwatch-bd56d.appspot.com/o/professional-watches-cosmograph-daytona-cover-video_portrait.mp4?alt=media&token=20426bb0-5cee-4a37-8273-6b4fae3f0e95"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default Video;
