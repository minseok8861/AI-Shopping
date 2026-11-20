import { createContext, useContext } from 'react';

export const ProductLikesContext = createContext(null);

export function useProductLike(product) {
  const { likesById, setLikesById } = useContext(ProductLikesContext);
  const initiallyLiked = Boolean(product.liked);
  const liked = likesById[product.id] ?? initiallyLiked;

  function setLiked(nextLiked) {
    setLikesById((previous) => ({ ...previous, [product.id]: nextLiked }));
  }

  return {
    liked,
    setLiked,
    likeCount: product.likes + Number(liked) - Number(initiallyLiked),
  };
}
