import React from 'react';
import { Link } from 'react-router';
import styles from './PromoGrid.module.css';

export default function PromoGrid() {
  const promoItems = [
    {
      id: 1,
      category: "MEN'S COLLECTION",
      title: "Bold & Classic Frames",
      image: "https://technoii.com/assets/images/manbanner.jpeg", 
      link: "/products?category=men",
      gridArea: styles.mainArea
    },
    {
      id: 2,
      category: "WOMEN'S COLLECTION",
      title: "Chic & Trendy Styles",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800",
      link: "/products?category=women",
      gridArea: styles.subArea1
    },
    {
      id: 3,
      category: "PREMIUM LENSES",
      title: "World Class Vision",
      image: "https://images.unsplash.com/photo-1511499767390-90342f5b89a8?auto=format&fit=crop&w=800",
      link: "/products?category=lenses",
      gridArea: styles.subArea2
    }
  ];

  return (
    <section className={styles.promoSection}>
      <div className={styles.container}>
        {promoItems.map((item) => (
          <Link 
            key={item.id} 
            to={item.link} 
            className={`${styles.promoCard} ${item.gridArea}`}
          >
            <img src={item.image} alt={item.title} className={styles.bgImage} />
            <div className={styles.content}>
              <span className={styles.catLabel}>{item.category}</span>
              <h3 className={styles.promoTitle}>{item.title}</h3>
              <span className={styles.shopNow}>Explore Collection</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}