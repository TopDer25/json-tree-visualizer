import React, { useState } from 'react'
import './components.css'

function SearchBox({ searchQuery, setSearchQuery }) {
  const [inputValue, setInputValue] = useState('')

  const handleSearch = () => {
    setSearchQuery(inputValue.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div id='searchBox'>
        <input 
          type="text" 
          placeholder='e.g., name, address.city, projects[0].title'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className='btn' onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBox;