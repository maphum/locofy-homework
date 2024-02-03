// src/App.tsx

import React, { useState, useCallback } from 'react';
import TreeView from './components/TreeView';
import NodeComponent from './components/NodeComponent';
import { Node, setupParent, detachParentAndGroupNodes, findNodeById, addNewNode, deleteSelected, adjustParentBounds, rootNode, findMostIntersectingSibling } from './types';
import { useSelectedNodes } from './contexts/SelectedNodesContext';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node>(setupParent(rootNode));
  const { selectedNodes, setSelectedNodes } = useSelectedNodes();

  const groupSelectedNodes = useCallback(() => {
    if (selectedNodes.length < 2) {
      console.log("Select at least two nodes to group.");
      return;
    }
    setNodes({
      ...
      detachParentAndGroupNodes(nodes, selectedNodes)
    })
  }, [nodes, selectedNodes]);


  const handleNodeSelect = useCallback((nodeId: string, ctrlPressed: boolean) => {
    if (ctrlPressed) {
      setSelectedNodes(prev => prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]);
    } else {
      setSelectedNodes([nodeId]);
    }
  }, []);

  const moveNode = useCallback((id: string, newX: number, newY: number) => {
    const node = findNodeById(nodes, id);
    if (node == undefined) return;
    const deltaX = newX - node.x;
    const deltaY = newY - node.y;

    const updateNodePosition = (node: Node): void => {
      node.x += deltaX;
      node.y += deltaY;
      node.children.map(updateNodePosition);
    };

    adjustParentBounds(node.parentNode!)
    updateNodePosition(node);
    const siblings = node.parentNode!.children.map(node => node.id).filter(nodeId => nodeId != id);
    const nearestNode = findMostIntersectingSibling(node);
    if (nearestNode !== null) {
      setSelectedNodes([...selectedNodes.filter(NodeId => !siblings.includes(NodeId)), nearestNode.id])
    }
    else {
      setSelectedNodes([id])
    }
    setNodes({ ...nodes });
  }, [nodes, selectedNodes, setSelectedNodes]);

  return (
    <div className="App h-screen grid grid-cols-4">
      <div className='col-span-1 grid grid-flow-row grid-rows-2'>
        <TreeView
          node={nodes}
          onNodeSelect={handleNodeSelect}
          selectedNodeIds={selectedNodes}
        // expandIdsProp={listExpandIds(nodes, selectedNodes)}
        />
        <div className='flex flex-col items-start p-5 border border-t-4 border-t-gray-600'>
          <span className='font-medium mb-4'>Hold Ctrl to select multiple Nodes</span>
          <button
            onClick={groupSelectedNodes}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ marginBottom: '10px' }}
          >
            Group Nodes
          </button>
          <span className='font-medium mb-2'>Make new child node inside root node or inside selected nodes:</span>

          <button
            onClick={() => {
              addNewNode(nodes, selectedNodes);
              setNodes({ ...nodes });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ marginBottom: '10px' }}
          >
            New node
          </button>
          <button
            onClick={() => {
              deleteSelected(nodes, selectedNodes)
              setSelectedNodes([]);
              setNodes({ ...nodes });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ marginBottom: '10px' }}
          >
            Delete selected
          </button>
          <button
            onClick={() => {
              deleteSelected(nodes, nodes.children.map(node => node.id))
              setSelectedNodes([])
              setNodes({ ...nodes });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ marginBottom: '10px' }}
          >
            Reset
          </button>
        </div>

      </div>
      <div
        className="relative col-span-3"
        style={{ background: '#FAEBD7' }}
        onClick={() => setSelectedNodes([])} // Reset selected nodes on click
        onMouseUp={e => {

          if (e.ctrlKey) return;
          groupSelectedNodes();
        }}
      >
        {nodes.children?.map((childNode) => (
          <NodeComponent
            key={childNode.id}
            node={childNode}
            isSelected={selectedNodes.includes(childNode.id)}
            onSelect={handleNodeSelect}
            onMove={moveNode}
          />
        ))}
      </div>
    </div>

  );
};

export default App;

