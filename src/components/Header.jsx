import React from 'react'
import './components.css'
import { useTheme } from '../context/ThemeContext'

function Header() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div id='headers'>
      <h1>JSON Tree Visualizer</h1>
      <div className="themeColor">
        <span>
          {theme === 'light' ? 'Light' : 'Dark'} Mode
        </span>
        <label className="switch">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme}/>
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  )
}

export default Header