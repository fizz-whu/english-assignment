# Daily Words - English Learning Application

A beautiful, modern React application that helps you learn 20 English words every day. Each word comes with definitions, examples, Chinese translations, and audio pronunciation.

## Features

- **Daily Word Lists**: 20 carefully selected words each day from a pool of 7000 words
- **Smart Rotation**: Words are shuffled and divided into 350 groups, cycling automatically
- **Interactive Learning**:
  - Click any word to see detailed information
  - Audio pronunciation using Web Speech API and dictionary audio
  - English definitions and example sentences
  - Chinese translations
- **Progress Tracking**: Mark words as learned and track your daily progress
- **Persistent Storage**: Your progress is saved in localStorage
- **Beautiful UI**: Clean, modern design with light/dark mode support
- **Responsive**: Works perfectly on desktop and mobile devices

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Dictionary API** - Word definitions and phonetics
- **Translation API** - Chinese translations
- **Web Speech API** - Text-to-speech pronunciation
- **AWS S3 + CloudFront** - Hosting and CDN
- **GitHub Actions** - CI/CD

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd daily-words
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for automatic deployment to AWS S3 and CloudFront using GitHub Actions.

### AWS Setup

See [AWS_SETUP_GUIDE.md](./AWS_SETUP_GUIDE.md) for detailed instructions on:
- Creating an S3 bucket for static website hosting
- Setting up CloudFront distribution
- Configuring IAM permissions
- Adding GitHub repository secrets

### Automatic Deployment

Once AWS is configured and GitHub secrets are set, every push to the `main` branch will:
1. Install dependencies
2. Build the project
3. Deploy to S3
4. Invalidate CloudFront cache

## Project Structure

```
daily-words/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/                     # Static assets
├── scripts/
│   └── shuffleWords.js        # Word shuffling script
├── src/
│   ├── components/            # React components
│   │   ├── Header.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── WordList.jsx
│   │   ├── WordItem.jsx
│   │   └── WordDetailModal.jsx
│   ├── data/
│   │   └── wordGroups.json   # Shuffled word groups
│   ├── utils/
│   │   └── wordUtils.js      # Utility functions
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── AWS_SETUP_GUIDE.md        # AWS setup instructions
└── README.md                 # This file
```

## How It Works

### Word Selection Logic

1. **Start Date**: The app uses November 11, 2025 as the starting date
2. **Day Calculation**: Calculates days elapsed since start date
3. **Group Selection**: Selects one of 350 word groups based on day index
4. **Cycling**: After 350 days, it cycles back to the first group

### Data Management

- **Word Groups**: 7000 words shuffled and divided into 350 groups of 20 words
- **Progress Storage**: Learned words saved in browser's localStorage
- **API Integration**: Real-time fetching of definitions and translations

## Customization

### Changing the Word Pool

1. Edit `scripts/shuffleWords.js`
2. Replace the `words` array with your word list
3. Run the script:
   ```bash
   node scripts/shuffleWords.js
   ```

### Modifying the Start Date

Edit `src/utils/wordUtils.js` and change the `START_DATE` constant:
```javascript
const START_DATE = new Date('2025-11-11');
```

### Styling

The app uses Tailwind CSS with custom colors defined in `tailwind.config.js`. Modify the theme to customize colors, fonts, and other design aspects.

## APIs Used

- **Dictionary API**: [dictionaryapi.dev](https://dictionaryapi.dev/) - Free dictionary API
- **Translation API**: [MyMemory Translation API](https://mymemory.translated.net/) - Free translation service

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Speech API support required for pronunciation
- localStorage required for progress tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Check [AWS_SETUP_GUIDE.md](./AWS_SETUP_GUIDE.md) for deployment issues
- Open an issue on GitHub
- Review the browser console for client-side errors

## Acknowledgments

- Word list sourced from common English vocabulary lists
- UI design inspired by modern learning applications
- Icons from Google Material Symbols
