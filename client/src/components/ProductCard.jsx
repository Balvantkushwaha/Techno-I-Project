import { Link } from 'react-router';
import { Star, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  return (
    <div className={styles.cardWrapper}>
      {/* Wishlist Icon */}
      <button className={styles.wishlistBtn} aria-label="Add to wishlist">
        <Heart size={18} />
      </button>

      <Link to={`/product/${product.id}`} className={styles.productCard}>
        <div className={styles.imageContainer}>
          {product.discount > 0 && (
            <div className={styles.discountBadge}>{product.discount}% OFF</div>
          )}
          
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.productImage}
          />
          
          {/* Rating Badge on Image (Lenskart style) */}
          <div className={styles.ratingBadge}>
            <span>{product.rating}</span>
            <Star size={10} fill="currentColor" />
            <span className={styles.reviewCount}>| {product.reviews}</span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.brand}>{product.brand}</p>
          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          {/* <p className={styles.taxLabel}>with GST</p> */}
        </div>
      </Link>
    </div>
  );
}
