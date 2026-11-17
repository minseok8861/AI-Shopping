import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CategoryPanel } from '../components/CategoryPanel.jsx';
import { Header } from '../components/Header.jsx';
import { numberFormat, products } from '../components/products.js';
import { Button, ColorSwatch, HeartButton } from '../components/ui/index.js';
import { useCategoryPanel } from '../hooks/useCategoryPanel.js';
import { useProductLike } from '../hooks/useProductLike.js';
import './ProductDetailScreen.css';

function OptionPicker({ label, title, options, selected, open, onToggle, onSelect, showSwatches }) {
  const listId = useId();
  const toggleRef = useRef(null);

  return (
    <div className="product-detail-picker">
      <button ref={toggleRef} type="button" className="product-detail-picker-toggle"
        aria-label={selected ? `${label} 선택 (${selected})` : `${label} 선택`}
        aria-expanded={open} aria-controls={listId} onClick={onToggle}>
        <span className="product-detail-picker-value">
          {title}
          {selected && (
            <strong className="product-detail-selected-value">
              {showSwatches && <ColorSwatch color={selected} />}
              {selected}
            </strong>
          )}
        </span>
      </button>
      <ul id={listId} aria-label={label} hidden={!open}>
        {options.map((option) => (
          <li key={option}>
            <button type="button" aria-pressed={selected === option} onClick={() => {
              onSelect(option);
              toggleRef.current?.focus();
            }}>
              {showSwatches && <ColorSwatch color={option} />}
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail({ product }) {
  const { liked, setLiked, likeCount } = useProductLike(product);
  const [section, setSection] = useState('details');
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const hasSelection = Boolean(color && size);
  const total = `${numberFormat.format(product.price * quantity)}원`;
  const sections = [
    { id: 'details', label: '상세정보' },
    { id: 'sizes', label: '사이즈' },
    { id: 'recommended', label: '추천' },
    { id: 'reviews', label: `리뷰(${product.reviews})` },
    { id: 'questions', label: product.questions ? `Q&A(${product.questions})` : 'Q&A' },
  ];

  function selectOption(option, current, setOption, setOpen) {
    setOption(option);
    setOpen(false);
    if (option !== current) setQuantity(1);
  }

  return (
    <>
      <div className="product-detail-grid">
        <div className="product-detail-media" aria-hidden="true" />
        <section className="product-detail-info" aria-labelledby="product-detail-title">
          <p className="product-detail-brand">{product.brand}</p>
          <p className="product-detail-category"><Link to="/women/all">WOMEN</Link> › 아우터</p>
          <h1 id="product-detail-title">{product.name}</h1>
          <p className="product-detail-rating">
            <span className="rating-star" aria-hidden="true">★</span> {product.rating} · 리뷰 {product.reviews}개
          </p>
          <span className="product-detail-shipping-badge">무료배송</span>

          <div className="product-detail-price">
            {product.originalPrice && <del>{numberFormat.format(product.originalPrice)}원</del>}
            <p>
              {product.discount && <span>{product.discount}% </span>}
              <strong>{numberFormat.format(product.price)}원</strong>
            </p>
          </div>

          <dl className="product-detail-delivery">
            <dt>배송정보</dt><dd>3일 이내 배송 시작</dd>
            <dt>배송비</dt><dd>무료배송<small>제주/도서산간 3,000원 추가</small></dd>
          </dl>

          <div className="product-detail-options">
            <OptionPicker label="색상" title="COLOR" options={product.colors} selected={color}
              open={colorOpen} onToggle={() => setColorOpen(!colorOpen)} showSwatches
              onSelect={(option) => selectOption(option, color, setColor, setColorOpen)} />
            <OptionPicker label="사이즈" title="SIZE" options={product.sizes} selected={size}
              open={sizeOpen} onToggle={() => setSizeOpen(!sizeOpen)}
              onSelect={(option) => selectOption(option, size, setSize, setSizeOpen)} />
          </div>

          {hasSelection && (
            <>
              <div className="product-detail-selection">
                <div>
                  <strong className="product-detail-selected-value">
                    <ColorSwatch color={color} />
                    {color} · {size}
                  </strong>
                  <p>3일 이내 배송 시작</p>
                </div>
                <div className="product-detail-quantity" role="group" aria-label="수량">
                  <button type="button" aria-label="수량 줄이기" disabled={quantity === 1}
                    onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}>−</button>
                  <span aria-live="polite">{quantity}</span>
                  <button type="button" aria-label="수량 늘리기"
                    onClick={() => setQuantity((previous) => previous + 1)}>+</button>
                </div>
                <strong className="product-detail-selection-price">{total}</strong>
              </div>
              <div className="product-detail-total" aria-live="polite">
                <span>총 상품 금액</span><strong>{total}</strong>
              </div>
            </>
          )}

          <div className="product-detail-actions">
            <div className="product-detail-likes">
              <HeartButton pressed={liked} onPressedChange={setLiked} />
              <span>{likeCount}</span>
            </div>
            <Button disabled>장바구니</Button>
            <Button variant="black" disabled>구매하기</Button>
          </div>
        </section>
      </div>

      <div className="product-detail-sections" role="group" aria-label="상품 정보 메뉴">
        {sections.map(({ id, label }) => (
          <button key={id} type="button" aria-pressed={id === section} onClick={() => setSection(id)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export function ProductDetailScreen({ accountActions }) {
  const { productId } = useParams();
  const product = products.find(({ id }) => String(id) === productId);
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  return (
    <div className="storefront" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ home: '/', best: '/#outfits', outfits: '/#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        accountActions={accountActions}
        showUnavailableActions
      />
      <main className="product-detail">
        <CategoryPanel activeCategory={activeCategory} />
        {product ? <ProductDetail key={product.id} product={product} /> : (
          <>
            <h1>상품을 찾을 수 없습니다.</h1>
            <Link to="/women/all">여성 상품 목록으로 돌아가기</Link>
          </>
        )}
      </main>
    </div>
  );
}
