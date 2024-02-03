import React, { useState } from 'react';
import { Node } from '../types';
import { useSelectedNodes } from '../contexts/SelectedNodesContext';

interface NodeComponentProps {
    node: Node;
    isSelected: boolean;
    onSelect: (nodeId: string, ctrlPressed: boolean) => void;
    onMove: (id: string, x: number, y: number) => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, isSelected, onSelect, onMove }) => {
    const [isDragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedNodes } = useSelectedNodes();
    const handleMouseDown = (e: React.MouseEvent) => {

        setDragStart({
            x: e.clientX - node.x,
            y: e.clientY - node.y,
        });
        setDragging(true);
        e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {

            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            onMove(node.id, newX, newY);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach event listeners when dragging starts
    if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    const style = {
        left: `${node.x - (node.parentNode !== undefined ? node.parentNode.x : 0)}px`,
        top: `${node.y - (node.parentNode !== undefined ? node.parentNode.y : 0)}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        backgroundColor: node.background,
        position: 'absolute' as const,
        border: selectedNodes.includes(node.id) ? '4px solid white' : '4px solid gray', // Highlight if selected
        radius: '4px',
        zIndex: selectedNodes.includes(node.id) ? 1000 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            style={style}
            onMouseDown={e => {
                handleMouseDown(e);
                onSelect(node.id, e.ctrlKey);
                e.stopPropagation();
            }}
            onClick={(e) => {
                // onSelect(node.id, e.ctrlKey)
                e.stopPropagation();
            }}
            className={`rounded-lg`}
        >
            <div className='relative'>
                {node.children?.map((childNode) => (
                    <NodeComponent
                        key={childNode.id}
                        node={childNode}
                        isSelected={isSelected}
                        onSelect={onSelect}
                        onMove={onMove} // Pass onMove down to child components
                    />
                ))}
            </div>
        </div>
    );
};


export default NodeComponent;
