import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Top Section */}
        <div className={styles.grid}>

          {/* Brand */}
          <div>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <Eye size={20} />
              </div>
              <span className={styles.brandName}>Technoii</span>
            </div>

            <p className={styles.description}>
              Your trusted partner for premium eyewear and lenses. Quality vision
              care since 2020.
            </p>
          </div>

          {/* Shop */}
          <FooterColumn title="Shop">
            <FooterLink to="/products?category=eyeglasses">Eyeglasses</FooterLink>
            <FooterLink to="/products?category=sunglasses">Sunglasses</FooterLink>
            <FooterLink to="/products?category=lenses">Contact Lenses</FooterLink>
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="Support">
            <span>Help Center</span>
            <span>Track Order</span>
            <span>Returns</span>
            <span>Shipping Info</span>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <span>Email: support@technoii.com</span>
            <span>Phone: +91 98765 43210</span>
            <span>Mon–Sat: 9AM – 8PM</span>
          </FooterColumn>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          © 2026 Technoii. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* Helpers */
function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className={styles.columnTitle}>{title}</h4>
      <div className={styles.columnContent}>{children}</div>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className={styles.link}>
      {children}
    </Link>
  );
}
