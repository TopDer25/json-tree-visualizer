import React from 'react'
import './components.css'
import { useJSONInput } from '../context/JSONInputContext'

function TextArea() {
  const { jsonValue, updateJsonValue } = useJSONInput()

  const handleChange = (e) => {
    updateJsonValue(e.target.value)
  }

  return (
    <div id='textArea'>
        <span>Paste or type JSON data</span>
        <textarea value={jsonValue} onChange={handleChange}/> 
        <button className='btn'>Generate Tree</button>
    </div>
  )
}

export default TextArea