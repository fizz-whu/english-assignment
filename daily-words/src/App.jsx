import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import WordList from './components/WordList';
import WordDetailModal from './components/WordDetailModal';
import { getDailyWords, getLearnedWords, markWordAsLearned } from './utils/wordUtils';

function App() {
  const [dailyWords, setDailyWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    try {
      // Get today's words
      const words = getDailyWords();
      console.log('Daily words loaded:', words.length, 'words');
      setDailyWords(words);

      // Get learned words from localStorage
      const learned = getLearnedWords();
      setLearnedWords(learned);

      // Set current date
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setCurrentDate(date);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }, []);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleCloseModal = () => {
    setSelectedWord(null);
  };

  const handleMarkAsLearned = (word) => {
    const updatedLearnedWords = markWordAsLearned(word);
    setLearnedWords(updatedLearnedWords);
    setSelectedWord(null);
  };

  const isWordLearned = (word) => {
    return learnedWords.includes(word.toLowerCase());
  };

  const learnedCount = dailyWords.filter(word => isWordLearned(word)).length;
  const progress = dailyWords.length > 0 ? (learnedCount / dailyWords.length) * 100 : 0;

  return (
    <div className="bg-custom-gray-light dark:bg-background-dark font-display text-custom-text-light dark:text-custom-text-dark">
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex h-full grow flex-col">
          <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
            <Header />
            <main className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-3xl font-black tracking-tight text-gray-800 dark:text-gray-200 md:text-4xl">
                  Words for {currentDate}
                </h2>
              </div>
              <ProgressBar
                learnedCount={learnedCount}
                totalCount={dailyWords.length}
                progress={progress}
              />
              <WordList
                words={dailyWords}
                onWordClick={handleWordClick}
                isWordLearned={isWordLearned}
              />
            </main>
          </div>
        </div>
      </div>

      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          isLearned={isWordLearned(selectedWord)}
          onClose={handleCloseModal}
          onMarkAsLearned={() => handleMarkAsLearned(selectedWord)}
        />
      )}
    </div>
  );
}

export default App;
