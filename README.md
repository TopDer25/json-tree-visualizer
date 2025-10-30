# JSON Tree Visualizer

A modern, interactive web application for visualizing JSON data structures as hierarchical node trees. Built with React and powered by React Flow, this tool makes it easy to understand and navigate complex JSON objects through an intuitive visual representation.

![JSON Tree Visualizer](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple) ![React Flow](https://img.shields.io/badge/React%20Flow-12.9.1-green)

## ✨ Features

### 🌳 Interactive Tree Visualization
- **Hierarchical Display**: Visualize JSON structures as a parent-child node tree
- **Color-Coded Nodes**: 
  - 🟣 **Purple** for Objects (`{}`)
  - 🟢 **Green** for Arrays (`[]`)
  - 🟠 **Orange** for Primitives (strings, numbers, booleans, null)
- **Connected Relationships**: Animated edges connecting parent and child nodes
- **Interactive Controls**: Zoom, pan, and navigate with built-in controls
- **Mini Map**: Quick navigation overview of the entire tree structure

### 🔍 Advanced Search Functionality
- **JSON Path Search**: Search nodes using JSON path notation
  - Supports formats like: `name`, `address.city`, `projects[0].title`, `$.user.email`
- **Smart Matching**: Flexible path matching with partial and exact matches
- **Visual Highlighting**: Matching nodes highlighted in red with enhanced borders and shadows
- **Auto-Navigation**: Automatically pans and zooms to center matched nodes
- **Search Results**: Real-time feedback showing "Match found" or "No match found"

### 🎨 Theme Support
- **Light/Dark Mode**: Toggle between light and dark themes
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: Seamless theme switching

### 💻 User-Friendly Interface
- **JSON Text Editor**: Large textarea for JSON input with syntax support
- **Real-Time Updates**: Tree visualization updates instantly as you edit JSON
- **Error Handling**: Graceful handling of invalid JSON input
- **Responsive Design**: Works across different screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Json-tree-Visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### Basic Workflow

1. **Input JSON Data**
   - Paste or type your JSON data into the textarea on the left side
   - The default JSON structure is pre-loaded as an example
   - The tree visualization updates automatically

2. **Explore the Tree**
   - Use zoom controls (+/-) to zoom in/out
   - Click and drag to pan around the canvas
   - Use the minimap for quick navigation

3. **Search for Nodes**
   - Enter a JSON path in the search box
   - Examples:
     - `name` - finds the "name" property
     - `address.city` - finds nested "city" in "address"
     - `projects[0]` - finds the first item in "projects" array
     - `projects[0].title` - finds "title" in the first project
   - Click "Search" or press Enter
   - Matching nodes will be highlighted and the view will pan to them

4. **Toggle Theme**
   - Click the theme toggle switch in the header
   - Your preference is automatically saved

### Search Path Formats

The search functionality supports various JSON path formats:

| Format | Example | Description |
|--------|---------|-------------|
| Simple key | `name` | Matches `root.name` |
| Nested path | `address.city` | Matches `root.address.city` |
| JSONPath style | `$.user.email` | Matches `root.user.email` |
| Array index | `projects[0]` | Matches `root.projects.[0]` |
| Nested array | `projects[0].title` | Matches `root.projects.[0].title` |
| Partial match | `city` | Matches any node containing "city" |

## 🛠️ Technologies Used

- **React 19.1.1** - UI library
- **React Flow (@xyflow/react 12.9.1)** - Node-based graph visualization
- **Vite 7.1.7** - Build tool and development server
- **CSS3** - Styling with CSS variables for theme support

## 📁 Project Structure

```
Json-tree-Visualizer/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Header with theme toggle
│   │   ├── TextArea.jsx            # JSON input textarea
│   │   ├── SearchBox.jsx           # Search input component
│   │   ├── TreeVisualizer.jsx      # Container for tree visualization
│   │   ├── PreviewTreeVisualizer.jsx  # Main React Flow visualization
│   │   └── components.css         # Component styles
│   ├── context/
│   │   ├── JSONInputContext.jsx    # JSON data state management
│   │   └── ThemeContext.jsx        # Theme state management
│   ├── App.jsx                     # Root component
│   ├── JSONTreeVisualizer.jsx      # Main application component
│   ├── main.jsx                    # Application entry point
│   ├── index.css                   # Global styles
│   └── App.css                     # App-specific styles
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🎯 Key Components

### PreviewTreeVisualizer
The core visualization component that:
- Parses JSON into nodes and edges
- Renders the tree structure using React Flow
- Handles search functionality and node highlighting
- Manages view navigation and panning

### JSONInputContext
Provides global state management for:
- JSON input value
- Update and clear functions
- Default JSON example data

### ThemeContext
Manages application theming:
- Light/dark mode state
- Theme persistence in localStorage
- Theme toggle functionality

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

### Code Structure

The application uses React Context API for state management:
- **JSONInputContext**: Manages JSON data across components
- **ThemeContext**: Handles theme state globally

Component architecture follows a container-presentational pattern:
- Container components (TreeVisualizer) manage state and logic
- Presentational components (PreviewTreeVisualizer, SearchBox) handle UI rendering

## 🎨 Customization

### Node Colors
Node colors can be customized in `PreviewTreeVisualizer.jsx`:
- Objects: `#8b5cf6` (purple)
- Arrays: `#4ade80` (green)
- Primitives: `#ffa500` (orange)
- Highlight (search match): `#ef4444` (red)

### Theme Colors
Theme variables can be adjusted in CSS files using CSS custom properties.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available for use and modification.

## 🐛 Troubleshooting

### JSON Not Parsing
- Ensure your JSON is valid (check for trailing commas, proper quotes, etc.)
- Use a JSON validator to verify your input

### Search Not Finding Nodes
- Try using exact paths like `address.city` instead of partial matches
- Check that the JSON path matches the actual structure
- Remember that array indices start from 0

### Visualization Not Updating
- Clear the input and re-paste your JSON
- Check the browser console for any error messages
  
  