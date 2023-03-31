// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import styles from "@/styles/Home.module.css";
// Import Swiper styles
import "swiper/css";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useRef } from "react";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";

const UpComing: React.FC<{
  slides: {
    img: string;
    brand: string;
    title: string;
    text: string;
  }[];
}> = (props) => {
  const { slides } = props;
  const swiperRef = useRef<SwiperCore>();
  const sliderSettings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    425: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    580: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  };
  return (
    <div className={styles.upComingMain}>
      <h1>the upcoming Competitions</h1>
      <Swiper
        breakpoints={sliderSettings}
        slidesPerView={5}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {slides.map((slide, i) => {
          return (
            <SwiperSlide key={i}>
              <div className={styles.upComCarouItem}>
                <Image
                  src={slide.img}
                  alt="slideImage"
                  width={200}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
                <div className={styles.upComDet}>
                  <div className={styles.upComTextTop}>
                    <h4>{slide.brand}</h4>
                    <p>{slide.title}</p>
                  </div>
                  <p className={styles.upComTextBot}>{slide.text}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className={styles.SwiperButt}>
        <button onClick={() => swiperRef.current?.slidePrev()}>
          <BsArrowLeft />
        </button>
        <button onClick={() => swiperRef.current?.slideNext()}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
};

export default UpComing;
