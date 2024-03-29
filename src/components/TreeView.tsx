// src/components/TreeView.tsx

import React, { useState } from 'react';
import { Node } from '../types';
interface TreeViewProps {
    node: Node;
    onNodeSelect: (nodeId: string, ctrlPressed: boolean) => void;
    selectedNodeIds: string[];
    // expandIdsProp: string[]
}


const TreeView: React.FC<TreeViewProps> = ({ node, onNodeSelect, selectedNodeIds }) => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedIds(expandedIds.includes(id) ? expandedIds.filter(expandedId => expandedId !== id) : [...expandedIds, id]);
    };
    const expand = (id: string) => {
        return expandedIds.includes(id);
    }
    const renderTree = (node: Node): JSX.Element => (
        <div>
            <div className="flex justify-between items-center">
                <span className={`flex items-center cursor-pointer text-sm  ${node.children ? 'font-normal' : ''} ${selectedNodeIds.includes(node.id) ? 'text-blue-400' : " text-gray-800"} `} onClick={() => toggleExpand(node.id)}>
                    {expand(node.id) ? (
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <line x1="8" y1="12" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" />
                            <line x1="16" y1="12" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <line x1="12" y1="8" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="16" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )} {node.name}
                </span>
                <a className={`cursor-pointer font-medium text-sm py-1 px-2 ${selectedNodeIds.includes(node.id) ? 'text-blue-400' : 'text-blue-700'}`} onClick={(e) => onNodeSelect(node.id, e.ctrlKey)}>
                    Select
                </a>
            </div>
            {expand(node.id) && node.children && (
                <div className="ml-4">
                    {node.children.map(childNode => renderTree(childNode))}
                </div>
            )}
        </div>
    );

    return (
        <div className="overflow-auto">
            {renderTree(node)}
        </div>
    );
};

export default TreeView;
