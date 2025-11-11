import wordGroups from '../data/wordGroups.json';

const START_DATE = '2025-11-11'; // Starting from today

/**
 * Get the day index since the start date
 */
export function getDayIndex() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(START_DATE);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays % 350; // Cycle through 350 days
}

/**
 * Get today's words based on the day index
 */
export function getDailyWords() {
  const dayIndex = getDayIndex();
  return wordGroups[dayIndex] || [];
}

/**
 * Get learned words from localStorage
 */
export function getLearnedWords() {
  const stored = localStorage.getItem('learnedWords');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Mark a word as learned and save to localStorage
 */
export function markWordAsLearned(word) {
  const learnedWords = getLearnedWords();
  const wordLower = word.toLowerCase();

  if (!learnedWords.includes(wordLower)) {
    learnedWords.push(wordLower);
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
  }

  return learnedWords;
}

/**
 * Get word details from dictionary API
 */
export async function getWordDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error('Word not found');
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching word definition:', error);
    return null;
  }
}
