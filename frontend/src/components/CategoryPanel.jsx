import './CategoryPanel.css';

const categories = {
  women: ['ALL', '아우터', '상의', '바지', '스커트', '원피스', '액세서리'],
  men: ['ALL', '아우터', '상의', '하의', '액세서리'],
};

export function CategoryPanel({ activeCategory }) {
  return (
    <div id="category-panel" className="category-panel" data-category={activeCategory}
      hidden={!activeCategory}>
      {activeCategory && (
        <ul aria-label={activeCategory === 'women' ? '여성 상품 분류' : '남성 상품 분류'}>
          {categories[activeCategory].map((category) => <li key={category}>{category}</li>)}
        </ul>
      )}
    </div>
  );
}
