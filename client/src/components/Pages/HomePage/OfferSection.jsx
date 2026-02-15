import { Link } from 'react-router';
import styles from './OfferSection.module.css';

export default function OfferSection() {
  const promoBanners = [
    {
      id: 1,
      tag: 'LIMITED OFFER',
      title: 'Buy 1 Get 1 Free',
      desc: 'On all premium sunglasses collection',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800',
      link: '/products?offer=bogo'
    },
    {
      id: 2,
      tag: 'NEW ARRIVAL',
      title: 'Flat 30% Off',
      desc: 'On Computer Glasses',
      image: 'https://images.unsplash.com/photo-1511499767390-90342f5b89a8?auto=format&fit=crop&w=800',
      link: '/products?category=computer'
    }
  ];

  return (
    <section className={styles.offers}>
      <div className={styles.container}>
        {promoBanners.map((promo) => (
          <Link to={promo.link} key={promo.id} className={styles.banner}>
            <img src={promo.image} alt={promo.title} />
            <div className={styles.overlay}>
              <span className={styles.tag}>{promo.tag}</span>
              <h2>{promo.title}</h2>
              <p>{promo.desc}</p>
              <span className={styles.shopBtn}>SHOP NOW</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}