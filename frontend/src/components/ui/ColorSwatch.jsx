import { colorPalette } from '../colorPalette.js';
import './ColorSwatch.css';

export function ColorSwatch({ color }) {
  if (!Object.hasOwn(colorPalette, color)) return null;

  return <span className="ui-color-swatch" aria-hidden="true" style={{ backgroundColor: colorPalette[color] }} />;
}
