import { CategoryPanel } from '../components/CategoryPanel.jsx';
import { Header } from '../components/Header.jsx';
import { useCategoryPanel } from '../hooks/useCategoryPanel.js';
import './HomeScreen.css';

const outfits = [
  ['추위는 막고, 스타일은 살리고', '추운 날에도 따뜻하게, 편안함과 스타일을 모두 잡는 패딩 룩'],
  ['따뜻함은 챙기고, 우아함은 더하고', '차분하고 세련된 무드로 완성하는 클래식 코트 룩'],
  ['심플하게 입고, 존재감은 더하고', '평범한 일상에 특별한 포인트를 더하는 레더 재킷 룩'],
];

export function HomeScreen() {
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();

  return (
    <div className="storefront" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ home: './', best: '#outfits', outfits: '#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        showUnavailableActions
      />
      <main className="storefront-main">
        <section className="intro">
          <h1>당신의 취향, 온도를 읽다.</h1>
          <p>오늘의 기분부터 나만의 스타일 발견까지.</p>
          <a href="#outfits">AI 코디네이터 시작하기</a>
        </section>
        <section id="outfits" className="outfits">
          <h2>오늘의 코디 추천</h2>
          <div className="outfit-grid">
            {outfits.map(([title, description]) => (
              <article key={title}>
                <div className="outfit-image" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <CategoryPanel activeCategory={activeCategory} />
      </main>
    </div>
  );
}
