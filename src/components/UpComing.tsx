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
import { useEffect, useRef } from "react";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { useTranslations } from "next-intl";


const UpComing: React.FC<{
  slides: {
    img: string;
    brand: string;
    title: string;
    text: string;
  }[];
}> = (props) => {
  const t = useTranslations("home");
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
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector(
        `.${styles.background6 ?? "undefined"}`
      ) as HTMLElement & { style: CSSStyleDeclaration };
      if (background) {
        background.style.backgroundPositionY =
          window.scrollY === 0 ? "-124px" : `${-window.scrollY}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={styles.upComingMain}>
      <h1 className={styles.background6}>{
        t("upcoming")
      }</h1>
      <Swiper
        breakpoints={sliderSettings}
        slidesPerView={5}
        loop={true}
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
                  width={170}
                  height={170}
                  style={{ objectFit: "cover" }}
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
