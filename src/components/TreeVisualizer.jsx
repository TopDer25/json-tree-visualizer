import React, { useState } from 'react'
import SearchBox from './SearchBox'
import PreviewTreeVisualizer from './PreviewTreeVisualizer'

function TreeVisualizer() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div id='treeVisualizer'>
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <PreviewTreeVisualizer searchQuery={searchQuery} />
    </div>
  )
}

export default TreeVisualizer