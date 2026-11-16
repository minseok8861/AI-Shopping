import { CatalogResults } from '../components/CatalogResults.jsx';
import { CategoryPanel } from '../components/CategoryPanel.jsx';
import { womenCategories } from '../components/categories.js';
import { Header } from '../components/Header.jsx';
import { useCategoryPanel } from '../hooks/useCategoryPanel.js';
import './WomenScreen.css';

export function WomenScreen({ accountActions }) {
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();
  return (
    <div className="storefront women-storefront" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ home: '/', best: '/#outfits', outfits: '/#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        accountActions={accountActions}
        showUnavailableActions
      />
      <main className="women-catalog" aria-labelledby="women-catalog-title">
        <aside className="women-catalog-sidebar">
          <h1 id="women-catalog-title">WOMEN</h1>
          <ul>
            {womenCategories.map((category) => (
              <li key={category} aria-current={category === 'ALL' ? 'page' : undefined}>
                {category}
              </li>
            ))}
          </ul>
        </aside>
        <CatalogResults label="여성 전체 상품" />
        <CategoryPanel
          activeCategory={activeCategory}
          onWomenAllClick={() => toggleCategory('women')}
        />
      </main>
    </div>
  );
}
