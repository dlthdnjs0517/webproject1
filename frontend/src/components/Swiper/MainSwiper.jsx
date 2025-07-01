import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MainSwiper.css";

function MainSwiper() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
    >
      <SwiperSlide className="slide01"></SwiperSlide>
      <SwiperSlide className="slide02"></SwiperSlide>
      <SwiperSlide className="slide03"></SwiperSlide>
    </Swiper>
  );
}

export default MainSwiper;
