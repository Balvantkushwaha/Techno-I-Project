import { createBrowserRouter } from 'react-router';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { NotFound } from './components/NotFound';
import HomePage from './components/Pages/HomePage/HomePage';
import { Layout } from './components/Layout/Layout';
import { Cart } from './components/Pages/CartPage/CartPage';
import { Checkout } from './components/Pages/CartPage/Checkout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import AdminLoginPage from './components/Pages/AdminLoginPage/AdminLoginPage';

export const router = createBrowserRouter([
   // ✅ Admin route (NO layout)
  {
    path: "/adminlogin",
    Component: AdminLoginPage,
  },

  // ✅ Main app with layout
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      {path: "login", Component: Login},
      {path: "signup", Component: Signup}, 
      {path: "forgot-password", Component: ForgotPassword},    
      { path: 'products', Component: Products },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: "adminlogin", Component: AdminLoginPage },
      { path: '*', Component: NotFound },
    ],
  },
]);
