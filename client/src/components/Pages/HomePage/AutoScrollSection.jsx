import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../../ProductCard';
import styles from './AutoScrollSection.module.css';

export default function AutoScrollSection({ title, products, viewAllLink = "/products" }) {
  
  // Manual aur Auto dono ke liye list ko triple kar dete hain 
  // taaki user scroll karke bhi end tak jaldi na pahuche
  const displayProducts = [...products, ...products, ...products];

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.autoSection}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 style={{borderLeft: '4px solid var(--color-primary)', paddingLeft: '10px'}}>{title}</h2>
        </div>
        <Link to={viewAllLink} className={styles.viewAll} style={{color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px'}}>
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.scrollTrack}>
          {displayProducts.map((p, index) => (
            <div key={`${p.id}-${index}`} className={styles.cardItem}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}