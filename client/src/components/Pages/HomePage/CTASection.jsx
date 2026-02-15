import React from 'react';
import { Send, ShoppingBag } from 'lucide-react';
import styles from './CTASection.module.css';

export default function CTASection({ 
  title = "Get 20% Off Your First Order", 
  subtitle = "Join our community and be the first to know about new collections and exclusive offers.",
  buttonText = "Subscribe Now",
  type = "newsletter" // 'newsletter' or 'sale'
}) {
  return (
    <section className={`${styles.ctaContainer} ${type === 'sale' ? styles.saleBg : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          
          {type === 'newsletter' ? (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className={styles.input}
              />
              <button type="submit" className={styles.submitBtn}>
                {buttonText} <Send size={18} />
              </button>
            </form>
          ) : (
            <button className={styles.shopBtn}>
              {buttonText} <ShoppingBag size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}