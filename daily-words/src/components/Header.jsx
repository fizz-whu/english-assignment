function Header() {
  return (
    <header className="flex items-center justify-between border-b border-custom-border-light dark:border-custom-border-dark pb-4">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-custom-blue-dark text-white">
          <span className="material-symbols-outlined text-base">translate</span>
        </div>
        <h1 className="text-xl font-bold text-custom-blue-dark dark:text-custom-gray-light">
          Daily Words
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <a
          className="hidden text-sm font-medium text-gray-600 hover:text-custom-blue-dark dark:text-gray-400 dark:hover:text-white sm:block"
          href="#"
        >
          Progress
        </a>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
            settings
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
