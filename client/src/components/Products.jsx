import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Filter, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { apiService } from "../services/api";
import styles from "./Products.module.css";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  // --- States ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- Filter Initial State ---
  const [filters, setFilters] = useState({
    category: categoryParam || "all",
    frameShape: [],
    frameSize: [],
    frameMaterial: [],
    colors: [],
    gender: "all",
    priceRange: { min: 0, max: 10000 },
    inStockOnly: false,
    sortBy: "featured",
  });

  // --- Side Effects ---
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  // --- API Call ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await apiService.filterProducts(filters);
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Filter Logic ---
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentValue = prev[filterType];
      if (Array.isArray(currentValue)) {
        const newArray = currentValue.includes(value)
          ? currentValue.filter((item) => item !== value)
          : [...currentValue, value];
        return { ...prev, [filterType]: newArray };
      }
      return { ...prev, [filterType]: value };
    });

    // Sync Category with URL
    if (filterType === "category") {
      value === "all" ? searchParams.delete("category") : searchParams.set("category", value);
      setSearchParams(searchParams);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      frameShape: [],
      frameSize: [],
      frameMaterial: [],
      colors: [],
      gender: "all",
      priceRange: { min: 0, max: 10000 },
      inStockOnly: false,
      sortBy: "featured",
    });
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  // --- Internal Filter UI Component ---
  const FilterSidebarUI = () => (
    <div className={styles.filterContent}>
      {/* Category Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Category</h3>
        <div className={styles.filterOptions}>
          {["all", "eyeglasses", "sunglasses", "lenses"].map((cat) => (
            <label key={cat} className={styles.checkboxLabel}>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => handleFilterChange("category", cat)}
                className={styles.checkbox}
              />
              <span className={styles.capitalize}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Frame Details (Hide for Lenses) */}
      {filters.category !== "lenses" && (
        <>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Frame Shape</h3>
            <div className={styles.filterOptions}>
              {["round", "square", "rectangle", "aviator", "cat-eye"].map((shape) => (
                <label key={shape} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.frameShape.includes(shape)}
                    onChange={() => handleFilterChange("frameShape", shape)}
                    className={styles.checkbox}
                  />
                  <span className={styles.capitalize}>{shape}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Price Range */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Price Range</h3>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min}
            onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, min: Number(e.target.value) })}
            className={styles.priceInput}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, max: Number(e.target.value) })}
            className={styles.priceInput}
          />
        </div>
      </div>

      <button className={styles.clearFiltersBtn} onClick={clearFilters}>
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className={styles.productsPage}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <h1 className={styles.title}>Our Products</h1>
          <p className={styles.subtitle}>Discover your perfect eyewear</p>
        </header>

        {/* Mobile Filter Button */}
        <button className={styles.mobileFilterButton} onClick={() => setShowMobileFilters(true)}>
          <Filter size={20} /> Filters & Sort
        </button>

        <div className={styles.contentWrapper}>
          {/* Sidebar - Desktop */}
          <aside className={styles.sidebarDesktop}>
            <FilterSidebarUI />
          </aside>

          {/* Sidebar - Mobile Drawer */}
          {showMobileFilters && (
            <div className={styles.mobileOverlay} onClick={() => setShowMobileFilters(false)}>
              <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                  <h2 className={styles.drawerTitle}>Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}><X size={24} /></button>
                </div>
                <FilterSidebarUI />
              </div>
            </div>
          )}

          {/* Main Product Section */}
          <main className={styles.mainContent}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsCount}>
                Showing <strong>{products.length}</strong> products
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.productGrid}>
                {[...Array(8)].map((_, i) => <div key={i} className={styles.skeleton} />)}
              </div>
            ) : products.length > 0 ? (
              <div className={styles.productGrid}>
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No products found matching your filters</p>
                <button onClick={clearFilters}>Reset Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}