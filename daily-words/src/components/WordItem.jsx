function WordItem({ word, isLearned, onClick }) {
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

  const handleClick = () => {
    console.log('WordItem clicked:', word);
    if (onClick) {
      onClick();
    } else {
      console.error('onClick handler is missing!');
    }
  };

  if (isLearned) {
    return (
      <div
        className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-transparent bg-green-50 p-4 transition-all dark:bg-custom-green/10"
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-custom-green text-white">
            <span className="material-symbols-outlined">done</span>
          </div>
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">
            {capitalizedWord}
          </p>
        </div>
        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
          arrow_forward_ios
        </span>
      </div>
    );
  }

  return (
    <div
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-custom-border-light bg-white p-4 transition-all hover:border-custom-blue-light hover:shadow-sm dark:border-custom-border-dark dark:bg-gray-800 dark:hover:border-custom-blue-light"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            volume_up
          </span>
        </div>
        <p className="text-base font-medium text-gray-800 dark:text-gray-200">
          {capitalizedWord}
        </p>
      </div>
      <span className="material-symbols-outlined text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500">
        arrow_forward_ios
      </span>
    </div>
  );
}

export default WordItem;
