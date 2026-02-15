import { createBrowserRouter } from 'react-router';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { NotFound } from './components/NotFound';
import HomePage from './components/Pages/HomePage/HomePage';
import { Layout } from './components/Layout/Layout';
import { Cart } from './components/Pages/CartPage/CartPage';
import { Checkout } from './components/Pages/CartPage/Checkout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'products', Component: Products },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: '*', Component: NotFound },
    ],
  },
]);
