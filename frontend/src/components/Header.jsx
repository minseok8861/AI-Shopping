import { Button } from './ui/index.js';
import './Header.css';

const utilityLinks = [
  { key: 'outfits', label: 'AI 코디', icon: 'M8 2l1.6 4.4L14 8l-4.4 1.6L8 14 6.4 9.6 2 8l4.4-1.6L8 2Z' },
  { key: 'profile', label: '마이페이지', icon: 'M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 14a6 6 0 0 1 12 0' },
  { key: 'favorites', label: '좋아요', icon: 'M8 13.5 2.5 8a3.5 3.5 0 0 1 5-5L8 3.5l.5-.5a3.5 3.5 0 0 1 5 5Z' },
  { key: 'cart', label: '장바구니', icon: 'M2 5h12l-1 9H3L2 5Zm3 0V4a3 3 0 0 1 6 0v1' },
];

const categoryLinks = [
  { key: 'best', label: 'BEST' },
  { key: 'women', label: 'WOMEN' },
  { key: 'men', label: 'MEN' },
];

function HeaderIcon({ path, width = 18, height = 18 }) {
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export function Header({
  links = {},
  cartCount = 0,
  onAccountClick,
  onSearch,
  activeCategory,
  onCategoryClick,
  showUnavailableActions = false,
}) {
  function handleSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('query').trim();
    if (query) onSearch(query);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-row site-header-top">
          <a className="site-header-brand" href={links.home ?? '/'}>ONDO</a>
          <nav className="site-header-utilities" aria-label="사용자 메뉴">
            {utilityLinks.map(({ key, label, icon }) => {
              const content = (
                <>
                  <HeaderIcon path={icon} width={key === 'favorites' ? 19 : 18}
                    height={key === 'favorites' ? 17 : 18} />
                  {label}
                  {key === 'cart' && cartCount > 0 && <span className="site-header-count">{cartCount}</span>}
                </>
              );

              if (links[key]) return <a key={key} href={links[key]} data-utility={key}>{content}</a>;
              if (showUnavailableActions) {
                return (
                  <button key={key} type="button" className="site-header-utility" data-utility={key} disabled>
                    {content}
                  </button>
                );
              }
              return null;
            })}
            {(onAccountClick || showUnavailableActions) && (
              <Button variant="account" className="site-header-account"
                onClick={onAccountClick} disabled={!onAccountClick}>
                로그인 / 회원가입
              </Button>
            )}
          </nav>
        </div>
        <div className="site-header-row site-header-bottom">
          <nav className="site-header-categories" aria-label="상품 카테고리">
            {categoryLinks.map(({ key, label }) => {
              if (onCategoryClick && key !== 'best') {
                return (
                  <button
                    key={key}
                    type="button"
                    data-category={key}
                    aria-expanded={activeCategory === key}
                    aria-controls="category-panel"
                    onClick={() => onCategoryClick(key)}
                  >
                    {label}
                  </button>
                );
              }

              return links[key] && <a key={key} href={links[key]} data-category={key}>{label}</a>;
            })}
          </nav>
          {(onSearch || showUnavailableActions) && (
            <form className="site-header-search" role="search" onSubmit={handleSearch}>
              <input type="search" name="query" aria-label="검색어" required disabled={!onSearch} />
              <button type="submit" aria-label="상품 검색" disabled={!onSearch}>
                <HeaderIcon width={17.6} height={17.42}
                  path="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-1.3 3.2 3.3 3.3" />
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
