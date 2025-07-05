import MainHeader from "../../components/MainHeader/MainHeader";
import MainSwiper from "../../components/Swiper/MainSwiper";
import bg1 from "../../assets/img/bg3.jpg";
import bg2 from "../../assets/img/bg2.jpg";
import bg3 from "../../assets/img/bg4.jpg";

function Home() {
  const bgImages = [bg1, bg2, bg3];
  return (
    <>
      <MainHeader />
      <MainSwiper bgImages={bgImages} />
    </>
  );
}

export default Home;
