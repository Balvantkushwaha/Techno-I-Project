import { Eye, Sun, Package } from 'lucide-react';
import { Link } from 'react-router';
import styles from './CategoriesSection.module.css';

const categories = [
  { id: 'eye', name: 'Eyeglasses', icon: Eye, link: '/products?category=eyeglasses' },
  { id: 'sun', name: 'Sunglasses', icon: Sun, link: '/products?category=sunglasses' },
  { id: 'lens', name: 'Lenses', icon: Package, link: '/products?category=lenses' },
];

export default function CategoriesSection() {
  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <Link key={cat.id} to={cat.link} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <h3>{cat.name}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}