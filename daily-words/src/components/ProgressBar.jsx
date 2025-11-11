function ProgressBar({ learnedCount, totalCount, progress }) {
  return (
    <div className="mt-6 flex flex-col gap-2 rounded-xl border border-custom-border-light bg-white p-6 dark:border-custom-border-dark dark:bg-background-dark">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-gray-700 dark:text-gray-300">
          Daily Progress
        </p>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {learnedCount}/{totalCount} learned
        </p>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-custom-blue-light transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
