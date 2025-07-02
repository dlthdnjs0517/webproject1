import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function MainSwiper({ bgImages }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
    >
      {bgImages.map((img, index) => (
        <SwiperSlide key={index}>
          <div
            className="slide-bg"
            style={{
              backgroundImage: `url(${img})`,
              backgroundPosition: "center",
              width: "100vw",
              height: "100vh",
              zIndex: 3,
              position: "relative",
            }}
          ></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default MainSwiper;
