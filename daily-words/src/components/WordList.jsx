import WordItem from './WordItem';

function WordList({ words, onWordClick, isWordLearned }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
      {words.map((word, index) => (
        <WordItem
          key={`${word}-${index}`}
          word={word}
          isLearned={isWordLearned(word)}
          onClick={() => onWordClick(word)}
        />
      ))}
    </div>
  );
}

export default WordList;
