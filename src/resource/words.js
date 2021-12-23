import { conjunctions } from './conjunctions';
import { wordsM } from './words-m';

// merge words and conjunctions
export const words = [...wordsM, ...conjunctions];