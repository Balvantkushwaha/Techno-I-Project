import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import styles from './HeroSection.module.css';

const dummyData = {
  banners: [
    {
      id: 1,
      title: "See the World with Perfect Vision",
      subtitle: "Discover premium eyewear designed for style.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200",
      link: "/products"
    },
    {
      id: 3,
      title: "Premium Eyewear Collection",
      subtitle: "Elevate your style with our premium eyewear.",
      image: "https://technoii.com/assets/images/manbanner.jpeg",
      link: "/products?category=eyewear"
    },

     {
      id: 4,
      title: "Premium Eyewear Collection",
      subtitle: "Elevate your style with our premium eyewear.",
      image: "https://technoii.com/assets/images/banner02.jpeg",
      link: "/products?category=eyewear"
    },
    {
      id: 5,
      title: "Premium Eyewear Collection",
      subtitle: "Elevate your style with our premium eyewear.",
      image: "https://static5.lenskart.com/media/uploads/bou-second-later-1812-av.png",
      link: "/products?category=eyewear"

    }

  ]
};

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/banners');
        setBanners(response.data);
      } catch (error) {
        console.error("Backend failed, using dummy banners", error);
        setBanners(dummyData.banners);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <section className={styles.heroContainer}>
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className={styles.mySwiper}
      >
        {banners.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className={styles.slide} 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.overlay}>
                <div className={styles.content}>
                  <h1 className={styles.heroTitle}>{slide.title}</h1>
                  <p className={styles.heroSubtitle}>{slide.subtitle}</p>
                  <div className={styles.heroCta}>
                    <Link to={slide.link} className={`${styles.btn} ${styles.primary}`}>
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}