import type { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel-react";

export const EmblaCarousel = (props: {
  options?: EmblaOptionsType;
  slides: ReactNode[];
}) => {
  const { options, slides } = props;
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((slide, index) => (
          <div className="embla__slide" key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};
