import './App.css'
import JSONTreeVisualizer from './JSONTreeVisualizer'
import { ThemeProvider } from './context/ThemeContext'
import { JSONInputProvider } from './context/JSONInputContext'

function App() {
  return (
    <ThemeProvider>
      <JSONInputProvider>
        <JSONTreeVisualizer/>
      </JSONInputProvider>
    </ThemeProvider>
  )
}

export default App
