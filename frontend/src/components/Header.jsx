import { Button } from './ui/index.js';
import { SearchBox } from './SearchBox.jsx';
import './Header.css';

const utilityLinks = [
  { key: 'outfits', label: 'AI 코디', icon: 'M8 0a8 8 0 0 0-7 12L0 16l4-1A8 8 0 1 0 8 0ZM4 8a.75.75 0 1 1 1.5 0A.75.75 0 0 1 4 8Zm3.25 0a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm3.25 0a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z' },
  { key: 'profile', label: '마이페이지', icon: 'M12 4a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM0 16a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7Z' },
  { key: 'favorites', label: '좋아요', icon: 'M8 16 1.4 9A4.8 4.8 0 0 1 8 2.1 4.8 4.8 0 0 1 14.6 9Z' },
  { key: 'cart', label: '장바구니', icon: 'M4 5V4a4 4 0 0 1 8 0v1h2.5L16 16H0L1.5 5Zm1.25 0h5.5V4a2.75 2.75 0 0 0-5.5 0Z' },
];

const categoryLinks = [
  { key: 'best', label: 'BEST' },
  { key: 'women', label: 'WOMEN' },
  { key: 'men', label: 'MEN' },
];

function HeaderIcon({ path, size = 16, filled = false }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'} fillRule="evenodd"
      stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.25" strokeLinecap="round">
      <path d={path} />
    </svg>
  );
}

export function Header({
  links = {},
  cartCount = 0,
  onAccountClick,
  accountActions,
  activeCategory,
  onCategoryClick,
  showUnavailableActions = false,
}) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-row site-header-top">
          <a className="site-header-brand" href={links.home ?? '/'}>ONDO</a>
          <nav className="site-header-utilities" aria-label="사용자 메뉴">
            {utilityLinks.map(({ key, label, icon }) => {
              const content = (
                <>
                  <HeaderIcon path={icon} filled />
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
            {accountActions ?? ((onAccountClick || showUnavailableActions) && (
              <Button variant="account" className="site-header-account"
                onClick={onAccountClick} disabled={!onAccountClick}>
                로그인 / 회원가입
              </Button>
            ))}
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
          <SearchBox showSuggestions />
        </div>
      </div>
    </header>
  );
}
