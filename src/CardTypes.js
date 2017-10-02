import { sampleSize } from 'lodash';

const CardTypes = [
  'diamond',
  'paper-plane-o',
  'anchor',
  'bolt',
  'cube',
  'leaf',
  'bicycle',
  'bomb',
];

// TODO: Add some more types

export const getCards = numberOfCards => sampleSize(CardTypes, numberOfCards);
