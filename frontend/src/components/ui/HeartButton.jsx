import { colorPalette } from '../colorPalette.js';
import './HeartButton.css';

export function HeartButton({
  pressed = false,
  onPressedChange,
  onClick,
  className = '',
  'aria-label': label = '좋아요',
  ...props
}) {
  function handleClick(event) {
    onClick?.(event);
    if (!event.defaultPrevented) onPressedChange?.(!pressed);
  }

  return (
    <button
      {...props}
      type="button"
      className={`ui-heart-button ${className}`}
      aria-label={label}
      aria-pressed={pressed}
      onClick={handleClick}
    >
      <svg aria-hidden="true" width="19" height="17" viewBox="0 0 19 17" style={{ '--heart-pressed': colorPalette.레드 }}>
        <path d="M9.5 15.9 2.3 8.7C-2 4.4 4.3-1.7 8.5 2.5l1 1 1-1c4.2-4.2 10.5 1.9 6.2 6.2z" />
      </svg>
    </button>
  );
}
