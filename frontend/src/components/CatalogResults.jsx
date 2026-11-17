import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductLike } from '../hooks/useProductLike.js';
import { colorPalette } from './colorPalette.js';
import { numberFormat, products } from './products.js';
import { HeartButton } from './ui/index.js';

function ProductCard({ product }) {
  const { liked, setLiked, likeCount } = useProductLike(product);

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
      <p className="women-product-brand">{product.brand}</p>
      <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
      <p className="women-product-price">
        {product.discount && <span>{product.discount}%</span>}
        {numberFormat.format(product.price)}
      </p>
      <p className="women-product-labels">
        {product.coupon && <span>쿠폰</span>}
        <span>무료배송</span>
      </p>
      <p className="women-product-stats">
        <span aria-label={`좋아요 ${likeCount}`} style={{ color: colorPalette.레드 }}>♥ {likeCount}</span>
        {product.rating && <span aria-label={`평점 ${product.rating}, 리뷰 ${product.reviews}개`}>
          <span className="rating-star" aria-hidden="true">★</span> {product.rating} ({product.reviews})
        </span>}
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
