import { Link, useSearchParams } from 'react-router-dom';
import { CatalogResults } from '../components/CatalogResults.jsx';
import { CategoryPanel } from '../components/CategoryPanel.jsx';
import { Header } from '../components/Header.jsx';
import { SearchBox } from '../components/SearchBox.jsx';
import { useCategoryPanel } from '../hooks/useCategoryPanel.js';
import './WomenScreen.css';

const relatedDressTerms = ['롱원피스', '여자 하객룩 원피스', '미니원피스', '여름원피스', '니트원피스', '가을원피스', '레이어드 원피스'];

export function SearchScreen({ accountActions }) {
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();

  return (
    <div className="storefront" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ home: '/', best: '/#outfits', outfits: '/#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        accountActions={accountActions}
        showUnavailableActions
      />
      <main className="women-catalog search-catalog" aria-label="상품 검색 결과">
        <div className="search-catalog-query">
          <SearchBox key={query} initialQuery={query} />
          {query.includes('원피스') && (
            <nav className="search-related" aria-label="연관 검색어">
              {relatedDressTerms.map((term) => (
                <Link key={term} to={{ search: new URLSearchParams({ q: term }).toString() }}>{term}</Link>
              ))}
            </nav>
          )}
        </div>
        {query && (
          <>
            <aside className="women-catalog-sidebar search-catalog-filters">
              <h1>필터</h1>
              <ul><li>필터1</li><li>필터2</li></ul>
            </aside>
            <CatalogResults key={query} label={`${query} 검색 결과`} />
          </>
        )}
        <CategoryPanel activeCategory={activeCategory} />
      </main>
    </div>
  );
}
