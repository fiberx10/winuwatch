import styles from "@/styles/Home.module.css";
import { useState } from "react";

const Video = () => {
  const [muted, setMuted] = useState(true);

  return (
    <div className={styles.vid}>
      <div className={styles.headerback}></div>
      <video width="100%" height="100%" autoPlay loop playsInline muted={muted}>
        <source src="https://maymana.ma/spot.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default Video;
