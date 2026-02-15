import { Truck, Shield, Clock } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: Shield, title: 'Authentic', desc: '100% Genuine' },
  { icon: Clock, title: 'Easy Returns', desc: '30 Days Return' },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className={styles.card}>
              <div className={styles.iconContainer}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div className={styles.textGroup}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}