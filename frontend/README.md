# EzyCompute Frontend

A professional React-based dashboard for the EzyCompute master-worker computation system.

## Features

- 📊 Real-time matrix and task visualization
- 👥 Connected clients monitoring
- ⚙️ Task status tracking
- 📡 Worker update logs
- 💾 Download matrix and results data
- 🎨 Professional, responsive UI
- 🔄 Auto-refresh every second

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

The development proxy is configured to forward API calls to `http://localhost:8000` (the FastAPI backend).

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Card.js
│   │   ├── ClientsTable.js
│   │   ├── Dashboard.js
│   │   ├── Header.js
│   │   ├── MatrixSection.js
│   │   ├── ResultsSection.js
│   │   ├── StatCard.js
│   │   ├── TasksGrid.js
│   │   └── WorkerLog.js
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Component Overview

- **Header**: Navigation and action buttons
- **Dashboard**: Main layout and orchestration
- **StatCard**: Key metrics display
- **Card**: Reusable card component
- **ClientsTable**: Connected workers status
- **TasksGrid**: Real-time task cards
- **MatrixSection**: Matrix configuration and preview
- **ResultsSection**: Task results viewer
- **WorkerLog**: Live worker messages

## API Integration

The frontend communicates with the FastAPI backend:

- `GET /admin/status` - Fetch current dashboard state
- `POST /admin/reset` - Reset all tasks
- `POST /admin/set_matrix_size` - Update matrix size
- `GET /admin/matrix_preview` - Get matrix data preview
- `GET /admin/download_matrix` - Download matrix CSV
- `GET /admin/download_results` - Download results CSV

## Styling

Uses CSS custom properties (CSS variables) for theming:

- Colors: Primary, success, warning, danger
- Shadows: Multiple shadow depths for elevation
- Responsive: Mobile-first design approach

## Performance

- Real-time updates via polling (1-second interval)
- Optimized re-renders with React hooks
- Efficient component composition

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
