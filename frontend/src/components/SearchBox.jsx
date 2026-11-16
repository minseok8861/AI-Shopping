import { useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchBox.css';

const recentKey = 'ondo-recent-searches';
const defaultRecent = ['원피스', '외투', '부츠컷'];
const popular = ['어그', '코트', '후드티', '패딩', '후드집업'];

function readRecent() {
  try {
    const saved = JSON.parse(localStorage.getItem(recentKey));
    return Array.isArray(saved) ? saved.filter((term) => typeof term === 'string') : defaultRecent;
  } catch {
    return defaultRecent;
  }
}

export function SearchBox({ initialQuery = '', showSuggestions = false }) {
  const [query, setQuery] = useState(initialQuery);
  const [expandedAt, setExpandedAt] = useState(null);
  const [recent, setRecent] = useState(readRecent);
  const { key } = useLocation();
  const navigate = useNavigate();
  const panelId = useId();
  const expanded = showSuggestions && expandedAt === key;

  function updateRecent(terms) {
    setRecent(terms);
    try {
      localStorage.setItem(recentKey, JSON.stringify(terms));
    } catch {
      // Search stays usable when storage is unavailable.
    }
  }

  function search(term) {
    const value = term.trim();
    if (!value) return;
    updateRecent([value, ...readRecent().filter((item) => item !== value)].slice(0, 5));
    setExpandedAt(null);
    if (showSuggestions) setQuery('');
    navigate({ pathname: '/search', search: new URLSearchParams({ q: value }).toString() });
  }

  return (
    <div
      className={`search-box${expanded ? ' search-box-expanded' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpandedAt(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setExpandedAt(null);
      }}
    >
      <form className="site-header-search" role="search" aria-label={showSuggestions ? '상단 상품 검색' : '결과 내 상품 검색'}
        onSubmit={(event) => { event.preventDefault(); search(query); }}>
        <input type="search" aria-label="검색어" required value={query}
          onFocus={() => { if (showSuggestions) { setRecent(readRecent()); setExpandedAt(key); } }}
          onClick={() => { if (showSuggestions) setExpandedAt(key); }}
          onChange={(event) => setQuery(event.target.value)} />
        <button type="submit" aria-label="상품 검색">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16"
            fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
            <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-1.3 3.2 3.3 3.3" />
          </svg>
        </button>
      </form>
      {expanded && (
        <section className="search-suggestions" aria-labelledby={panelId}>
          <h2 id={panelId}>최근 검색어</h2>
          <ul className="search-recent">
            {recent.map((term) => (
              <li key={term}>
                <button type="button" onClick={() => search(term)}>{term}</button>
                <button type="button" aria-label={`${term} 삭제`}
                  onClick={() => updateRecent(recent.filter((item) => item !== term))}>×</button>
              </li>
            ))}
          </ul>
          <h2>인기 검색어</h2>
          <ol className="search-popular">
            {popular.map((term) => (
              <li key={term}><button type="button" onClick={() => search(term)}>{term}</button></li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
