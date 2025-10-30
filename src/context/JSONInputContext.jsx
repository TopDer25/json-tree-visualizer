import React, { createContext, useContext, useState } from 'react'

const JSONInputContext = createContext()

export const useJSONInput = () => {
  const context = useContext(JSONInputContext)
  return context
}

export const JSONInputProvider = ({ children }) => {
  const defaultJSONValue = `{
  "userProfile": {
    "name": "Dhondiba Savant",
    "role": "Developer",
    "id": 4201,
    "contact": {
      "email": "dhondiba.s@example.com",
      "phone": null
    },
    "projects": [
      {
        "title": "JSON Tree Visualizer",
        "status": "Active",
        "version": 1.0
      },
      {
        "title": "Data ETL Script",
        "status": "Completed",
        "version": 2
      }
    ],
    "isAvailable": true
  }
}`
  
  const [jsonValue, setJsonValue] = useState(defaultJSONValue)

  const updateJsonValue = (value) => {
    setJsonValue(value)
  }

  const clearJsonValue = () => {
    setJsonValue('')
  }

  const value = {
    jsonValue,
    updateJsonValue,
    clearJsonValue
  }

  return (
    <JSONInputContext.Provider value={value}>
      {children}
    </JSONInputContext.Provider>
  )
}
