import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import styles from './ProductScrollSection.module.css';
import { ProductCard } from '../../ProductCard';

export default function ProductScrollSection({ title, products, category }) {
  if (!products || products.length === 0) return null;
   const viewAllLink = `/products?category=${category}`;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Link to={viewAllLink} className={styles.viewAll}>
          View All <ArrowRight size={18} />
        </Link>
      </div>

      <div className={styles.scrollContainer}>
        {products.map((p) => (
          <div key={p.id} className={styles.cardWrapper}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}