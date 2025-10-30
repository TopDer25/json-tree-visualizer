import React from 'react'
import Header from './components/Header'
import TextArea from './components/TextArea'
import TreeVisualizer from './components/TreeVisualizer'

function JSONTreeVisualizer() {
  return (
    <div>
        <Header/>
        <div id='visualizer'>
          <TextArea/>
          <TreeVisualizer/>
        </div>
    </div>
  )
}

export default JSONTreeVisualizer