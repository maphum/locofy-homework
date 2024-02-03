// src/contexts/SelectedNodesContext.tsx

import React, { createContext, useState, useContext, ReactNode, FC } from 'react';

interface SelectedNodesContextType {
    selectedNodes: string[];
    setSelectedNodes: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedNodesContext = createContext<SelectedNodesContextType | undefined>(undefined);

export const useSelectedNodes = () => {
    const context = useContext(SelectedNodesContext);
    if (!context) {
        throw new Error('useSelectedNodes must be used within a SelectedNodesProvider');
    }
    return context;
};

export const SelectedNodesProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    return (
        <SelectedNodesContext.Provider value={{ selectedNodes, setSelectedNodes }
        }>
            {children}
        </ SelectedNodesContext.Provider>
    );
};
