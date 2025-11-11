import { useState, useEffect } from 'react';
import { getWordDefinition } from '../utils/wordUtils';

function WordDetailModal({ word, isLearned, onClose, onMarkAsLearned }) {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chineseTranslation, setChineseTranslation] = useState('');

  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

  console.log('=== WordDetailModal Render ===');
  console.log('Word:', word);
  console.log('Is learned:', isLearned);
  console.log('Loading:', loading);
  console.log('Word data:', wordData ? 'loaded' : 'null');

  useEffect(() => {
    const fetchWordData = async () => {
      setLoading(true);
      const data = await getWordDefinition(word);
      setWordData(data);

      // Fetch Chinese translation
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`
        );
        const translationData = await response.json();
        if (translationData.responseData && translationData.responseData.translatedText) {
          setChineseTranslation(translationData.responseData.translatedText);
        }
      } catch (error) {
        console.error('Error fetching Chinese translation:', error);
      }

      setLoading(false);
    };

    fetchWordData();
  }, [word]);

  const playPronunciation = () => {
    console.log('=== Modal: Play pronunciation clicked ===', word);
    // Try to play audio from dictionary API if available
    if (wordData?.phonetics) {
      const audioPhonetic = wordData.phonetics.find(p => p.audio);
      if (audioPhonetic) {
        console.log('Playing audio from dictionary API');
        const audio = new Audio(audioPhonetic.audio);
        audio.play();
        return;
      }
    }

    // Fallback to Web Speech API
    console.log('Using Web Speech API');
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const getDefinition = () => {
    if (!wordData || !wordData.meanings || wordData.meanings.length === 0) {
      return 'Definition not available';
    }
    return wordData.meanings[0].definitions[0].definition;
  };

  const getExample = () => {
    if (!wordData || !wordData.meanings || wordData.meanings.length === 0) {
      return 'Example not available';
    }
    const firstMeaning = wordData.meanings[0];
    if (firstMeaning.definitions[0].example) {
      return firstMeaning.definitions[0].example;
    }
    return 'No example available';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={() => {
        console.log('=== Modal: Background clicked, closing modal ===');
        onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-custom-gray-light dark:bg-gray-800"
        style={{
          width: '100%',
          maxWidth: '32rem',
          borderRadius: '0.75rem',
          backgroundColor: '#F8F9FA',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={(e) => {
          console.log('=== Modal: Content area clicked, preventing close ===');
          e.stopPropagation();
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-custom-border-light bg-custom-blue-dark p-4 text-white dark:border-custom-border-dark">
          <h3 className="text-2xl font-bold">{capitalizedWord}</h3>
          <button
            onClick={() => {
              console.log('=== Modal: Close button clicked ===');
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Pronunciation Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={playPronunciation}
                className="flex items-center gap-2 rounded-lg bg-custom-blue-light px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                <span className="material-symbols-outlined text-base">volume_up</span>
                Play Pronunciation
              </button>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Definition
              </h4>
              <p className="mt-1 text-base text-gray-700 dark:text-gray-300">
                {getDefinition()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Example
              </h4>
              <p className="mt-1 text-base italic text-gray-700 dark:text-gray-300">
                "{getExample()}"
              </p>
            </div>
            {chineseTranslation && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Translation (Chinese)
                </h4>
                <p className="mt-1 text-base text-gray-700 dark:text-gray-300">
                  {chineseTranslation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-col gap-2 border-t border-custom-border-light p-4 dark:border-custom-border-dark sm:flex-row-reverse">
          {!isLearned && (
            <button
              onClick={() => {
                console.log('=== Modal: Mark as Learned button clicked ===');
                onMarkAsLearned();
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-custom-green px-4 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Mark as Learned
            </button>
          )}
          <button
            onClick={() => {
              console.log('=== Modal: Bottom Close button clicked ===');
              onClose();
            }}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200 px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordDetailModal;
