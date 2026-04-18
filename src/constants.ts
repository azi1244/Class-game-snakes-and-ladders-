import { SquareData } from './types';

export const SQUARES: SquareData[] = [
  { id: 1, word: 'Car', icon: '🚗', plural: 'Cars', ruleSuffix: 's' },
  { id: 2, word: 'Dog', icon: '🐶', plural: 'Dogs', ruleSuffix: 's' },
  { id: 3, word: 'Cat', icon: '🐱', plural: 'Cats', ruleSuffix: 's' },
  { id: 4, word: 'Toy', icon: '🧸', plural: 'Toys', ruleSuffix: 's' },
  { id: 5, word: 'Book', icon: '📚', plural: 'Books', ruleSuffix: 's' },
  { id: 6, word: 'Ball', icon: '⚽', plural: 'Balls', ruleSuffix: 's' },
  { id: 7, word: 'Bus', icon: '🚌', plural: 'Buses', ruleSuffix: 'es' },
  { id: 8, word: 'Box', icon: '📦', plural: 'Boxes', ruleSuffix: 'es' },
  { id: 9, word: 'Glass', icon: '🥛', plural: 'Glasses', ruleSuffix: 'es' },
  { id: 10, word: 'Dish', icon: '🍽️', plural: 'Dishes', ruleSuffix: 'es' },
  { id: 11, word: 'Fox', icon: '🦊', plural: 'Foxes', ruleSuffix: 'es' },
  { id: 12, word: 'Dress', icon: '👗', plural: 'Dresses', ruleSuffix: 'es' },
  { id: 13, word: 'Tree', icon: '🌳', plural: 'Trees', ruleSuffix: 's' },
  { id: 14, word: 'Apple', icon: '🍎', plural: 'Apples', ruleSuffix: 's' },
  { id: 15, word: 'Watch', icon: '⌚', plural: 'Watches', ruleSuffix: 'es' },
  { id: 16, word: 'Beach', icon: '🏖️', plural: 'Beaches', ruleSuffix: 'es' },
  { id: 17, word: 'Flower', icon: '🌸', plural: 'Flowers', ruleSuffix: 's' },
  { id: 18, word: 'Lunch', icon: '🍱', plural: 'Lunches', ruleSuffix: 'es' },
  { id: 19, word: 'Pencil', icon: '✏️', plural: 'Pencils', ruleSuffix: 's' },
  { id: 20, word: 'Potato', icon: '🥔', plural: 'Potatoes', ruleSuffix: 'es' },
  { id: 21, word: 'Cloud', icon: '☁️', plural: 'Clouds', ruleSuffix: 's' },
  { id: 22, word: 'Brush', icon: '🖌️', plural: 'Brushes', ruleSuffix: 'es' },
  { id: 23, word: 'Bird', icon: '🐦', plural: 'Birds', ruleSuffix: 's' },
  { id: 24, word: 'Finish', icon: '👑', plural: 'Finishes', ruleSuffix: 'es' },
];

export const SNAKES: Record<number, number> = {
  11: 4,
  18: 7,
  22: 12,
};

export const LADDERS: Record<number, number> = {
  3: 10,
  8: 15,
  14: 21,
};

export const PLAYER_COLORS = ['#3B82F6', '#EF4444']; 
