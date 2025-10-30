import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useJSONInput } from '../context/JSONInputContext'
import './components.css'

function PreviewTreeVisualizer({ searchQuery = '' }) {
  const { jsonValue } = useJSONInput()
  const reactFlowInstance = useRef(null)
  const [searchResult, setSearchResult] = React.useState(null) // { found: boolean, message: string }
  
  // Parse JSON and convert to nodes and edges
  const parseJSONToNodes = useCallback((jsonData) => {
    let nodeId = 0
    const allNodes = []
    const allEdges = []
    
    const traverse = (obj, parent = null, keyPath = 'root', xPos = 0, yPos = 0) => {
      const currentId = `node-${nodeId++}`
      let nodeType = 'primitive'
      let nodeLabel = ''
      let nodeColor = '#ffa500' // orange for primitives
      let children = []
      
      // Determine node type and properties
      if (obj === null) {
        nodeLabel = 'null'
        nodeType = 'primitive'
      } else if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
          nodeType = 'array'
          nodeLabel = `[${obj.length}]`
          nodeColor = '#4ade80' // green for arrays
          children = obj.map((item, index) => ({ value: item, key: index }))
        } else {
          nodeType = 'object'
          nodeLabel = '{}'
          nodeColor = '#8b5cf6' // purple for objects
          children = Object.entries(obj).map(([key, value]) => ({ key, value }))
        }
      } else {
        nodeLabel = typeof obj === 'string' ? `"${obj}"` : String(obj)
        nodeType = 'primitive'
      }
      
      // Create node
      const node = {
        id: currentId,
        type: 'default',
        position: { x: xPos, y: yPos },
        data: { 
          label: `${keyPath !== 'root' ? keyPath + ': ' : ''}${nodeLabel}`,
          type: nodeType,
          keyPath: keyPath // Store path for search matching
        },
        style: {
          background: nodeColor,
          color: '#fff',
          border: '2px solid #fff',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          minWidth: '120px',
          textAlign: 'center'
        }
      }
      
      allNodes.push(node)
      
      // Create edge from parent to current node
      if (parent) {
        allEdges.push({
          id: `edge-${parent}-${currentId}`,
          source: parent,
          target: currentId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 }
        })
      }
      
      // Recursively process children
      if (children.length > 0) {
        const childSpacing = 220
        const startX = xPos - ((children.length - 1) * childSpacing) / 2
        const childY = yPos + 140
        
        children.forEach((child, index) => {
          const childKey = typeof child.key === 'number' ? `[${child.key}]` : child.key
          const childPath = keyPath === 'root' ? childKey : `${keyPath}.${childKey}`
          const childX = startX + (index * childSpacing)
          
          traverse(child.value, currentId, childPath, childX, childY)
        })
      }
    }
    
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      // Start from center-top
      traverse(parsed, null, 'root', 500, 50)
      return { nodes: allNodes, edges: allEdges }
    } catch (error) {
      return { nodes: [], edges: [] }
    }
  }, [])
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!jsonValue || jsonValue.trim() === '') {
      return { nodes: [], edges: [] }
    }
    
    try {
      const parsed = JSON.parse(jsonValue)
      return parseJSONToNodes(parsed)
    } catch (error) {
      return { nodes: [], edges: [] }
    }
  }, [jsonValue, parseJSONToNodes])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const baseNodesRef = useRef(initialNodes) // Store original nodes for search
  
  // Update nodes and edges when jsonValue changes
  useEffect(() => {
    if (!jsonValue || jsonValue.trim() === '') {
      setNodes([])
      setEdges([])
      setSearchResult(null)
      baseNodesRef.current = []
      return
    }
    
    try {
      const parsed = JSON.parse(jsonValue)
      const { nodes: newNodes, edges: newEdges } = parseJSONToNodes(parsed)
      baseNodesRef.current = newNodes
      setNodes(newNodes)
      setEdges(newEdges)
      setSearchResult(null)
    } catch (error) {
      setNodes([])
      setEdges([])
      setSearchResult(null)
      baseNodesRef.current = []
    }
  }, [jsonValue, parseJSONToNodes, setNodes, setEdges])

  // Convert JSON path format to our keyPath format
  const normalizeSearchPath = useCallback((searchPath) => {
    if (!searchPath) return ''
    
    // Remove leading $ if present
    let normalized = searchPath.trim().replace(/^\$\.?/, '')
    
    // If it starts with . remove it
    if (normalized.startsWith('.')) {
      normalized = normalized.substring(1)
    }
    
    // If empty, return empty
    if (!normalized) return ''
    
    // Prepend 'root.' if it doesn't start with root
    if (!normalized.startsWith('root')) {
      normalized = 'root.' + normalized
    }
    
    return normalized
  }, [])

  // Normalize array bracket notation (convert [0] to .[0] or vice versa)
  const normalizeArrayNotation = useCallback((path) => {
    // Convert projects[0] to projects.[0] and vice versa
    return path.replace(/\.(\[\d+\])/g, '$1').replace(/([^\[])(\[\d+\])/g, '$1.$2')
  }, [])

  // Match search path to node path
  const doesPathMatch = useCallback((nodePath, searchPath) => {
    if (!nodePath || !searchPath) return false
    
    // Normalize both paths for array notation
    const normalizedNodePath = normalizeArrayNotation(nodePath)
    const normalizedSearchPath = normalizeArrayNotation(searchPath)
    
    // Exact match
    if (normalizedNodePath === normalizedSearchPath) return true
    
    // Remove 'root.' prefix from both for comparison
    const searchWithoutRoot = normalizedSearchPath.replace(/^root\.?/, '').replace(/^root/, '')
    const nodeWithoutRoot = normalizedNodePath.replace(/^root\.?/, '').replace(/^root/, '')
    
    // If search is empty after removing root, match root node only
    if (!searchWithoutRoot && nodePath === 'root') return true
    
    // Ends with match (e.g., "address.city" matches "root.address.city")
    if (normalizedNodePath.endsWith('.' + searchWithoutRoot) || 
        normalizedNodePath === searchWithoutRoot ||
        nodeWithoutRoot.endsWith('.' + searchWithoutRoot)) {
      return true
    }
    
    // Handle array notation: projects[0] should match projects.[0]
    const searchWithDots = searchWithoutRoot.replace(/\[(\d+)\]/g, '.[$1]')
    const searchWithoutDots = searchWithoutRoot.replace(/\.\[(\d+)\]/g, '[$1]')
    
    if (nodeWithoutRoot.endsWith('.' + searchWithDots) ||
        nodeWithoutRoot.endsWith('.' + searchWithoutDots) ||
        nodeWithoutRoot.includes(searchWithoutRoot) ||
        nodeWithoutRoot.includes(searchWithDots) ||
        nodeWithoutRoot.includes(searchWithoutDots)) {
      // Additional validation: make sure it's a path segment match
      const searchParts = searchWithoutRoot.split(/[\.\[\]]+/).filter(Boolean)
      const lastPart = searchParts[searchParts.length - 1]
      return nodeWithoutRoot.endsWith('.' + lastPart) || 
             nodeWithoutRoot.match(new RegExp(`\\[${lastPart}\\]|${lastPart}$`)) !== null ||
             nodePath === lastPart
    }
    
    return false
  }, [normalizeArrayNotation])

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery || !baseNodesRef.current.length) {
      // Reset highlighting - restore original nodes
      setNodes(baseNodesRef.current.map(node => {
        const baseColor = node.data.type === 'object' ? '#8b5cf6' : 
                        node.data.type === 'array' ? '#4ade80' : '#ffa500'
        return {
          ...node,
          style: {
            ...node.style,
            background: baseColor,
            border: '2px solid #fff',
            boxShadow: 'none'
          }
        }
      }))
      setSearchResult(null)
      return
    }

    const normalizedPath = normalizeSearchPath(searchQuery)
    let matchedNodeId = null
    let matchedCount = 0

    // Find matching nodes based on original nodes
    const updatedNodes = baseNodesRef.current.map(node => {
      const nodePath = node.data.keyPath || 'root'
      const baseColor = node.data.type === 'object' ? '#8b5cf6' : 
                      node.data.type === 'array' ? '#4ade80' : '#ffa500'
      
      const isMatch = doesPathMatch(nodePath, normalizedPath) || 
                     doesPathMatch(nodePath, searchQuery) // Also try without normalization
      
      if (isMatch) {
        matchedCount++
        if (!matchedNodeId) {
          matchedNodeId = node.id // Use first match for panning
        }
        return {
          ...node,
          style: {
            ...node.style,
            background: '#ef4444', // Red highlight for matches
            border: '3px solid #fff',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
          }
        }
      }
      
      return {
        ...node,
        style: {
          ...node.style,
          background: baseColor,
          border: '2px solid #fff',
          boxShadow: 'none'
        }
      }
    })

    setNodes(updatedNodes)

    // Pan to matched node
    if (matchedNodeId && reactFlowInstance.current) {
      setTimeout(() => {
        const matchedNode = updatedNodes.find(n => n.id === matchedNodeId)
        if (matchedNode && reactFlowInstance.current) {
          reactFlowInstance.current.setCenter(
            matchedNode.position.x, 
            matchedNode.position.y, 
            { zoom: 1.2, duration: 800 }
          )
        }
      }, 100)
    }

    // Set search result message
    if (matchedCount > 0) {
      setSearchResult({ found: true, message: `Match found: ${matchedCount} node(s)` })
    } else {
      setSearchResult({ found: false, message: 'No match found' })
    }
  }, [searchQuery, normalizeSearchPath, doesPathMatch, setNodes])
  
  return (
    <div id='PreviewTreeVisualizer' style={{ width: '100%', height: '60vh', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      {searchResult && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '10px 15px',
            borderRadius: '8px',
            backgroundColor: searchResult.found ? '#10b981' : '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {searchResult.message}
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(instance) => {
          reactFlowInstance.current = instance
        }}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export default PreviewTreeVisualizer