import { Link } from 'react-router-dom';
import { womenCategories } from './categories.js';
import './CategoryPanel.css';

const categories = {
  women: womenCategories,
  men: ['ALL', '아우터', '상의', '하의', '액세서리'],
};

export function CategoryPanel({ activeCategory, onWomenAllClick }) {
  return (
    <div id="category-panel" className="category-panel" data-category={activeCategory}
      hidden={!activeCategory}>
      {activeCategory && (
        <ul aria-label={activeCategory === 'women' ? '여성 상품 분류' : '남성 상품 분류'}>
          {categories[activeCategory].map((category) => (
            <li key={category}>
              {activeCategory === 'women' && category === 'ALL'
                ? <Link to="/women/all" onClick={onWomenAllClick}>ALL</Link>
                : category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
