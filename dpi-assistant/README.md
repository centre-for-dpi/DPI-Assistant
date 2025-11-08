# DPI Assistant Frontend

An interactive chat interface for the DPI (Digital Public Infrastructure) knowledge base, designed for global government officials to understand, adopt, and implement DPI for societal-scale transformation.

## Features

- **AI-Powered Chat**: Conversational interface powered by the DPI backend API
- **Real-time Responses**: Get instant answers to DPI-related questions
- **Source Citations**: View sources for all information provided
- **DPI Suggestions**: Receive relevant DPI recommendations based on context
- **Feedback System**: Rate responses to help improve the system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the API endpoint:
```bash
cp .env.example .env
```

3. Edit `.env` and set your API base URL:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at http://localhost:5173/

### Production Build
```bash
npm run build
```
The built files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Backend Setup

The DPI Assistant frontend requires the backend API to be running.

### Using Docker (Recommended)

From the `backend` folder:
```bash
docker-compose up
```
This will start the backend API on port 8080

### Running Locally

From the `backend` folder:
```bash
npm install
npm run dev
```

The API will be available at http://localhost:8080

## API Endpoints

The application consumes the following endpoints from the backend:

### POST `/api/chat`
Send a message to the DPI assistant

**Request:**
```json
{
  "message": "What is DPI?",
  "chatHistoryArray": [],
  "persona": "Default"
}
```

**Response:**
```json
{
  "id": "unique-id",
  "sender": "assistant",
  "answer": "DPI stands for...",
  "sources": ["DPI Knowledge Base"],
  "timestamp": 1234567890
}
```

### POST `/api/feedback`
Submit feedback for a message

**Request:**
```json
{
  "messageId": "message-id",
  "feedback": "up"
}
```

## Project Structure

```
dpi-assistant/
├── src/
│   ├── Components/       # React components
│   │   ├── ChatBot.jsx   # Main chat interface (API-powered)
│   │   ├── Home.jsx      # Landing page
│   │   └── ...
│   ├── services/         # API services
│   │   └── api.js        # Chat and feedback API calls
│   ├── App.jsx           # App router
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the DPI backend API | `http://localhost:3000` |

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lottie** - Animated icons
- **Lucide React** - Icon library

## Development

### Code Style
- Use functional components with hooks
- Follow React best practices
- Keep components modular and reusable

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### API Connection Issues

If you see "Failed to get response" errors:

1. **Check backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verify API URL in `.env`:**
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Check CORS settings** if running backend on different port

4. **View browser console** for detailed error messages

### Build Issues

If the build fails:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## License

This project is part of the DPI Assistant initiative by the Centre for Digital Public Infrastructure (CDPI).
