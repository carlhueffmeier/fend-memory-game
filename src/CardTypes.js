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
  'space-shuttle',
  'trophy',
  'wrench',
  'rocket',
  'scissors',
  'html5',
  'rebel',
  'bluetooth-b',
  'linux',
  'slack',
];

// TODO: Add some more types

export const getCards = numberOfCards => sampleSize(CardTypes, numberOfCards);
