import { colorNames } from './colorPalette.js';

const { 블랙, 실버, 아이보리, 베이지, 네이비, 그레이, 브라운 } = colorNames;

const jumper = {
  name: '라이트 점퍼 - 6 COLOR',
  price: 28900,
  coupon: true,
  likes: 148,
  rating: '4.3',
  reviews: 47,
  colors: [블랙, 실버, 아이보리, 베이지, 네이비, 그레이],
};

const fleece = {
  name: 'Reversible Mellow Fleece Jacket - Green',
  price: 46300,
  discount: 32,
  likes: 75,
  rating: '4.8',
  reviews: 23,
  liked: true,
  colors: [블랙, 그레이, 브라운],
};

const paddedJumper = {
  ...jumper,
  name: '[컬러,사이즈 추가]_(우먼)라이트 시어쉘 패딩 점퍼 - 6 COLOR',
  originalPrice: 165000,
  price: 78890,
  discount: 52,
  rating: '4.8',
  reviews: 140,
  questions: 23,
  coupon: false,
  colors: [블랙, 그레이, 브라운],
};

export const products = Array.from({ length: 8 }, (_, index) => ({
  brand: 'ONDO',
  sizes: ['S', 'M', 'L'],
  ...(index % 4 === 0 ? jumper : fleece),
  ...(index === 0 ? paddedJumper : {}),
  id: index + 1,
}));

export const numberFormat = new Intl.NumberFormat('ko-KR');

