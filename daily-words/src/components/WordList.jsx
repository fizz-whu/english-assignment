import WordItem from './WordItem';

function WordList({ words, onWordClick, isWordLearned }) {
  console.log('=== WordList Render ===');
  console.log('Words to render:', words.length);
  console.log('First 3 words:', words.slice(0, 3));
  console.log('onWordClick function:', typeof onWordClick);

  return (
    <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
      {words.map((word, index) => {
        const learned = isWordLearned(word);
        console.log(`Rendering word ${index + 1}: ${word}, learned: ${learned}`);
        return (
          <WordItem
            key={`${word}-${index}`}
            word={word}
            isLearned={learned}
            onClick={() => {
              console.log('WordList: onClick wrapper called for', word);
              onWordClick(word);
            }}
          />
        );
      })}
    </div>
  );
}

export default WordList;
