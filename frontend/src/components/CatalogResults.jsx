import { useState } from 'react';
import { HeartButton } from './ui/index.js';

const jumper = {
  name: '라이트 점퍼 - 6 COLOR',
  price: 28900,
  coupon: true,
  likes: 148,
  rating: '4.3',
  reviews: 47,
};

const fleece = {
  name: 'Reversible Mellow Fleece Jacket - Green',
  price: 46300,
  discount: 32,
  likes: 75,
  rating: '4.8',
  reviews: 23,
};

const products = Array.from({ length: 8 }, (_, index) => ({
  ...(index % 4 === 0 ? jumper : fleece),
  id: index + 1,
}));

const numberFormat = new Intl.NumberFormat('ko-KR');

function ProductCard({ product }) {
  const [liked, setLiked] = useState(Boolean(product.discount));

  return (
    <article className="women-product">
      <div className="women-product-media">
        <HeartButton
          className="women-product-heart"
          aria-label={`${product.name} 좋아요`}
          pressed={liked}
          onPressedChange={setLiked}
        />
      </div>
      <p className="women-product-brand">ONDO</p>
      <h2>{product.name}</h2>
      <p className="women-product-price">
        {product.discount && <span>{product.discount}%</span>}
        {numberFormat.format(product.price)}
      </p>
      <p className="women-product-labels">
        {product.coupon && <span>쿠폰</span>}
        <span>무료배송</span>
      </p>
      <p className="women-product-stats">
        <span aria-label={`좋아요 ${product.likes}`}>♥ {product.likes}</span>
        <span aria-label={`평점 ${product.rating}, 리뷰 ${product.reviews}개`}>
          ★ {product.rating} ({product.reviews})
        </span>
      </p>
    </article>
  );
}

export function CatalogResults({ label }) {
  const [sort, setSort] = useState('recommended');
  const sortedProducts = sort === 'recommended' ? products : [...products].sort((a, b) => (
    sort === 'price-asc' ? a.price - b.price : b.price - a.price
  ));

  return (
    <section className="women-catalog-results" aria-label={label}>
      <div className="women-catalog-toolbar">
        <select aria-label="상품 정렬" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="recommended">추천순</option>
          <option value="price-asc">낮은 가격순</option>
          <option value="price-desc">높은 가격순</option>
        </select>
      </div>
      <div className="women-catalog-grid">
        {sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
