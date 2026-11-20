import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login, { LoginScreen } from './Login.jsx';
import Signup from './SIgnup.jsx';
import Account from './Account.jsx';
import { Button } from './components/ui/index.js';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { WomenScreen } from './screens/WomenScreen.jsx';
import { SearchScreen } from './screens/SearchScreen.jsx';
import { ProductDetailScreen } from './screens/ProductDetailScreen.jsx';
import { CartScreen } from './screens/CartScreen.jsx';
import { CartContext } from './hooks/useCart.js';
import { ProductLikesContext } from './hooks/useProductLike.js';

const cartStorageKey = 'ondo-cart';

function readCart() {
  try {
    const items = JSON.parse(sessionStorage.getItem(cartStorageKey));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function Storefront({ Screen = HomeScreen }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('http://localhost:8080/member/status', {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted && data.loggedIn) setMember(data);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('로그인 상태 확인 실패:', error);
      });

    return () => controller.abort();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) setMember(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }

  return (
    <Screen
      accountActions={member ? (
        <>
          <span>환영합니다!</span>
          <Link to="/account" className="site-header-account ui-button ui-button-account">내 정보 관리</Link>
          <Button variant="account" className="site-header-account" onClick={handleLogout}>
            로그아웃
          </Button>
        </>
      ) : (
        <Link to="/login" className="site-header-account ui-button ui-button-account">
          로그인 / 회원가입
        </Link>
      )}
    />
  );
}

export default function App() {
  const [likesById, setLikesById] = useState({});
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    try {
      sessionStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    } catch {
      // Keep the cart available in memory when browser storage is unavailable.
    }
  }, [cartItems]);

  function addToCart(product, color, size, quantity) {
    const key = JSON.stringify([product.id, color, size]);
    setCartItems((items) => {
      const existing = items.find((item) => item.key === key);
      if (!existing) return [...items, { key, product, color, size, quantity }];
      return items.map((item) => item === existing
        ? { ...item, quantity: item.quantity + quantity }
        : item);
    });
  }

  function changeCartQuantity(key, delta) {
    setCartItems((items) => items.map((item) => item.key === key
      ? { ...item, quantity: Math.max(1, item.quantity + delta) }
      : item));
  }

  function removeCartItems(keys) {
    setCartItems((items) => items.filter((item) => !keys.includes(item.key)));
  }

  function changeCartOptions(key, nextKey, color, size) {
    if (key === nextKey) return;
    setCartItems((items) => {
      const current = items.find((item) => item.key === key);
      if (!current) return items;
      if (!items.some((item) => item.key === nextKey)) {
        return items.map((item) => item === current ? { ...item, key: nextKey, color, size } : item);
      }
      return items.filter((item) => item !== current).map((item) => item.key === nextKey
        ? { ...item, quantity: item.quantity + current.quantity }
        : item);
    });
  }

  return (
    <BrowserRouter>
      <CartContext.Provider value={{ cartItems, addToCart, changeCartQuantity, removeCartItems, changeCartOptions }}>
        <ProductLikesContext.Provider value={{ likesById, setLikesById }}>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/women/all" element={<Storefront Screen={WomenScreen} />} />
            <Route path="/search" element={<Storefront Screen={SearchScreen} />} />
            <Route path="/products/:productId" element={<Storefront Screen={ProductDetailScreen} />} />
            <Route path="/cart" element={<Storefront Screen={CartScreen} />} />
            <Route path="/login" element={<Storefront Screen={LoginScreen} />} />
            <Route path="/login/email" element={<Storefront Screen={Login} />} />
            <Route path="/signup" element={<Storefront Screen={Signup} />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </ProductLikesContext.Provider>
      </CartContext.Provider>
    </BrowserRouter>
  );
}
