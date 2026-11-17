import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryPanel } from '../components/CategoryPanel.jsx';
import { Header } from '../components/Header.jsx';
import { numberFormat, products } from '../components/products.js';
import { Checkbox, HeartButton } from '../components/ui/index.js';
import { useCart } from '../hooks/useCart.js';
import { useCategoryPanel } from '../hooks/useCategoryPanel.js';
import { useProductLike } from '../hooks/useProductLike.js';
import './CartScreen.css';

const won = (amount) => numberFormat.format(amount) + '원';
const pageSize = 5;

function CartCheckbox({ checked, mixed, ...props }) {
  return (
    <Checkbox
      {...props}
      checked={checked}
      ref={(input) => { if (input) input.indeterminate = Boolean(mixed); }}
    />
  );
}

function CartItem({ item, checked, onSelect, onRemove, onQuantity, onOptions }) {
  const { product, color, size, quantity } = item;
  const [editing, setEditing] = useState(false);
  const [nextColor, setNextColor] = useState(color);
  const [nextSize, setNextSize] = useState(size);

  function toggleOptions() {
    setNextColor(color);
    setNextSize(size);
    setEditing(!editing);
  }

  return (
    <li className="cart-item">
      <Checkbox aria-label={product.name + ' ' + color + ' ' + size + ' 선택'}
        checked={checked} onChange={onSelect} />
      <div className="cart-item-content">
        <div className="cart-item-main">
          <Link className="cart-item-media" to={'/products/' + product.id} aria-label={product.name} />
          <div className="cart-item-details">
            <Link to={'/products/' + product.id}>{product.name}</Link>
            <p>{color} · {size}</p>
            <p className="cart-delivery">3일 이내 배송 시작</p>
            <div className="cart-quantity" role="group" aria-label={product.name + ' 수량'}>
              <button type="button" aria-label="수량 줄이기" disabled={quantity <= 1} onClick={() => onQuantity(-1)}>−</button>
              <span>{quantity}</span>
              <button type="button" aria-label="수량 늘리기" onClick={() => onQuantity(1)}>+</button>
            </div>
            <p className="cart-item-price">
              {product.discount > 0 && <span>{product.discount}%</span>}
              <strong>{won(product.price * quantity)}</strong>
              {product.originalPrice > product.price && <del>{won(product.originalPrice * quantity)}</del>}
            </p>
          </div>
          <button type="button" className="cart-remove" aria-label={product.name + ' 삭제'} onClick={onRemove}>×</button>
        </div>
        <div className="cart-item-actions">
          <button type="button" onClick={toggleOptions} aria-expanded={editing}>옵션 변경</button>
          <button type="button" disabled>쿠폰 사용</button>
        </div>
        {editing && (
          <form className="cart-options" onSubmit={(event) => {
            event.preventDefault();
            onOptions(nextColor, nextSize);
            setEditing(false);
          }}>
            <label>색상
              <select value={nextColor} onChange={(event) => setNextColor(event.target.value)}>
                {[...new Set([color, ...(product.colors ?? [])])].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>사이즈
              <select value={nextSize} onChange={(event) => setNextSize(event.target.value)}>
                {[...new Set([size, ...(product.sizes ?? [])])].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <button type="submit">적용</button>
          </form>
        )}
      </div>
    </li>
  );
}

function CartRecommendation({ product }) {
  const { liked, setLiked } = useProductLike(product);
  return (
    <li>
      <div className="cart-recommendation-media">
        <Link to={'/products/' + product.id} aria-label={product.name} />
        <HeartButton pressed={liked} onPressedChange={setLiked} aria-label={product.name + ' 좋아요'} />
      </div>
      <p>{product.brand}</p>
      <Link className="cart-recommendation-name" to={'/products/' + product.id}>{product.name}</Link>
    </li>
  );
}

function CartRecommendations({ cartItems }) {
  const [page, setPage] = useState(0);
  const recommendations = products.filter((product) => !cartItems.some((item) => item.product.id === product.id));
  const pageCount = Math.ceil(recommendations.length / pageSize);
  const currentPage = Math.min(page, pageCount - 1);

  if (!pageCount) return null;

  return (
    <section className="cart-recommendations" aria-labelledby="cart-recommendations-title">
      <h2 id="cart-recommendations-title">다른 고객이 함께 구매한 상품</h2>
      <ul>
        {recommendations.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((product) => (
          <CartRecommendation key={product.id} product={product} />
        ))}
      </ul>
      {pageCount > 1 && (
        <nav className="cart-pages" aria-label="추천 상품 페이지">
          <button type="button" aria-label="이전 추천 상품" disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)} />
          <span className="cart-page-count" aria-live="polite">
            <strong>{currentPage + 1}</strong><span>/</span><span>{pageCount}</span>
          </span>
          <button type="button" aria-label="다음 추천 상품" disabled={currentPage === pageCount - 1}
            onClick={() => setPage(currentPage + 1)} />
        </nav>
      )}
    </section>
  );
}

export function CartScreen({ accountActions }) {
  const { cartItems, changeCartQuantity, removeCartItems, changeCartOptions } = useCart();
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();
  const [excludedKeys, setExcludedKeys] = useState(() => new Set());
  const selectedItems = cartItems.filter((item) => !excludedKeys.has(item.key));
  const groups = new Map();
  for (const item of cartItems) {
    const brand = products.find(({ id }) => id === item.product.id)?.brand ?? item.product.brand;
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand).push(item);
  }
  const total = selectedItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const subtotal = selectedItems.reduce((sum, { product, quantity }) => (
    sum + Math.max(product.price, product.originalPrice ?? product.price) * quantity
  ), 0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function selectItems(items, checked) {
    setExcludedKeys((previous) => {
      const next = new Set(previous);
      for (const { key } of items) {
        if (checked) next.delete(key);
        else next.add(key);
      }
      return next;
    });
  }

  function removeItems(items) {
    removeCartItems(items.map(({ key }) => key));
    selectItems(items, true);
  }

  function updateOptions(item, color, size) {
    const nextKey = JSON.stringify([item.product.id, color, size]);
    if (nextKey === item.key) return;
    const existing = cartItems.some(({ key }) => key === nextKey);
    if (!existing) selectItems([{ key: nextKey }], !excludedKeys.has(item.key));
    selectItems([item], true);
    changeCartOptions(item.key, nextKey, color, size);
  }

  return (
    <div className="storefront" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ home: '/', best: '/#outfits', outfits: '/#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        accountActions={accountActions}
        showUnavailableActions
      />
      <main className="cart-screen">
        <CategoryPanel activeCategory={activeCategory} />
        <h1>장바구니</h1>
        {cartItems.length > 0 ? (
          <div className="cart-layout">
            <div>
              <div className="cart-toolbar">
                <label>
                  <CartCheckbox checked={selectedItems.length === cartItems.length}
                    mixed={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                    onChange={(event) => selectItems(cartItems, event.target.checked)} />
                  전체선택
                </label>
                <button type="button" disabled={!selectedItems.length} onClick={() => removeItems(selectedItems)}>선택삭제</button>
              </div>
              {Array.from(groups, ([brand, items]) => {
                const selectedCount = items.filter(({ key }) => !excludedKeys.has(key)).length;
                const groupTotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
                return (
                  <section key={brand} className="cart-group">
                    <h2>
                      <label>
                        <CartCheckbox checked={selectedCount === items.length}
                          mixed={selectedCount > 0 && selectedCount < items.length}
                          onChange={(event) => selectItems(items, event.target.checked)} />
                        {brand}
                        <span className="cart-group-chevron" aria-hidden="true" />
                      </label>
                    </h2>
                    <ul>
                      {items.map((item) => (
                        <CartItem key={item.key} item={item} checked={!excludedKeys.has(item.key)}
                          onSelect={(event) => selectItems([item], event.target.checked)}
                          onRemove={() => removeItems([item])}
                          onQuantity={(delta) => changeCartQuantity(item.key, delta)}
                          onOptions={(color, size) => updateOptions(item, color, size)} />
                      ))}
                    </ul>
                    <p className="cart-group-total">{won(groupTotal)} + 배송비 무료 = 총 {won(groupTotal)}</p>
                  </section>
                );
              })}
              <CartRecommendations cartItems={cartItems} />
            </div>
            <aside className="cart-summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">주문 금액</h2>
              <dl aria-live="polite">
                <div><dt>상품 금액</dt><dd>{won(subtotal)}</dd></div>
                <div><dt>할인 금액</dt><dd className="cart-discount">{subtotal > total ? '−' : ''}{won(subtotal - total)}</dd></div>
                <div><dt>배송비</dt><dd>{selectedItems.length ? '무료' : won(0)}</dd></div>
                <div className="cart-summary-total"><dt>총 결제 금액</dt><dd>{won(total)}</dd></div>
              </dl>
              <button type="button" disabled>{won(total)} 결제하기</button>
            </aside>
          </div>
        ) : (
          <p className="cart-empty">장바구니가 비어 있습니다.</p>
        )}
      </main>
    </div>
  );
}
