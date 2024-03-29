// src/types/index.ts
const groupName = 'new-group-';
const nodeName = 'node-';
let groupId = 1;
let nodeId = 6;
const colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]

export type Node = {
    id: string;
    x: number;
    y: number;
    name?: string;
    width: number;
    height: number;
    background: string;
    children: Node[];
    parentNode?: Node;
};

export const setupParent = (node: Node, parentNode: Node | undefined = undefined): Node => {
    const adjustedNode = {
        ...node,
        parentNode
    };
    adjustedNode.children = adjustedNode.children.map(child =>
        setupParent(child, adjustedNode));

    return adjustedNode;
};

export const detachParentAndGroupNodes = (rootNode: Node, selectedNodes: string[]): Node => {
    const groupNodes: Node[] = selectedNodes.map(nodeId => findNodeById(rootNode, nodeId)).filter(node => node !== undefined) as Node[]

    let sharedParent = groupNodes[0].parentNode || rootNode;

    groupNodes.forEach(node => {
        groupNodes.forEach(deleteNode => {
            deleteChildNodeById(node, deleteNode.id);
        })
        deleteChildNodeById(rootNode, node.id);
    })

    groupNodes.forEach(node => {
        let parentNode = node.parentNode;
        if (parentNode == undefined) return;
        parentNode = findNodeById(rootNode, parentNode.id) as Node;
        if (parentNode) {
            parentNode.children = parentNode.children.filter(child => child.id != node.id);
            parentNode.children.forEach(node => node.parentNode = parentNode);
        }
        if (sharedParent?.id !== parentNode?.id) {
            sharedParent = rootNode;
        }
        else sharedParent = parentNode

        node.parentNode = undefined;
    })

    const bounds = groupNodes.reduce((acc, node) => {
        if (node) {
            acc.minX = Math.min(acc.minX, node.x);
            acc.minY = Math.min(acc.minY, node.y);
            acc.maxX = Math.max(acc.maxX, node.x + node.width);
            acc.maxY = Math.max(acc.maxY, node.y + node.height);
        }
        return acc;
    }, { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 });
    const str = groupName + (groupId++);

    const newParentNode: Node = {
        id: str,
        name: str,
        x: bounds.minX - 20,
        y: bounds.minY - 20,
        width: bounds.maxX - bounds.minX + 20,
        height: bounds.maxY - bounds.minY + 20,
        background: getRandomColor(),
        children: groupNodes,
        parentNode: sharedParent,
    };

    groupNodes.forEach(node => { node.parentNode = newParentNode })
    sharedParent?.children.push(newParentNode);


    setupParent(rootNode);
    return rootNode;
}

export function findNodeById(rootNode: Node, id: string): Node | null {
    if (rootNode.id === id) return rootNode;
    for (const child of rootNode.children) {
        const found = findNodeById(child, id);
        if (found) return found;
    }
    return null;
}

export const deleteChildNodeById = (root: Node, nodeIdToDelete: string): Node => {
    const deleteNode = (node: Node, id: string): Node | null => {
        node.children = node.children.filter(child => child.id !== id)
            .map(child => deleteNode(child, id) || child);
        return node;
    };

    return deleteNode(root, nodeIdToDelete) || root;
};

export const adjustParentBounds = (parentNode: Node) => {
    if (parentNode == undefined || parentNode === null) return;
    let minX = parentNode.x;
    let minY = parentNode.y;
    let maxX = 0;
    let maxY = 0;

    parentNode.children.forEach(child => {
        const childRightEdge = child.x + child.width;
        const childBottomEdge = child.y + child.height;

        if (child.x < minX) minX = child.x;
        if (child.y < minY) minY = child.y;
        if (childRightEdge > maxX) maxX = childRightEdge;
        if (childBottomEdge > maxY) maxY = childBottomEdge;
    });

    // Adjust the parent's position and dimensions to include all children
    const deltaX = parentNode.x - minX;
    const deltaY = parentNode.y - minY;
    parentNode.x -= deltaX;
    parentNode.y -= deltaY;
    parentNode.width = Math.max(parentNode.width + deltaX, maxX - parentNode.x);
    parentNode.height = Math.max(parentNode.height + deltaY, maxY - parentNode.y);

    adjustParentBounds(parentNode.parentNode!)
};

export const addNewNode = (root: Node, selectedNodes: string[]) => {
    if (selectedNodes.length == 0) selectedNodes = [root.id]
    selectedNodes.map(id => findNodeById(root, id)).filter(node => node !== null).forEach(node => {
        const str = nodeName + (nodeId++).toString();
        node!.children.push({
            x: node!.x + 5,
            y: node!.y + 5,
            width: 75,
            height: 75,
            background: getRandomColor(),
            children: [],
            name: str,
            id: "Node" + str,
            parentNode: node!
        })
        adjustParentBounds(node!)
    })

}
export function findMostIntersectingSibling(node: Node): Node | null {

    if (!node.parentNode) {
        return null; // No parent means no siblings
    }

    let maxIntersection = 0;
    let mostIntersectingSibling: Node | null = null;

    node.parentNode.children.forEach(sibling => {
        if (sibling.id !== node.id) {
            const intersection = calculateIntersection(node, sibling);
            if (intersection > maxIntersection) {
                maxIntersection = intersection;
                mostIntersectingSibling = sibling;
            }
        }
    });
    return mostIntersectingSibling;
}

export function calculateIntersection(node1: Node, node2: Node): number {
    const xOverlap = Math.max(0, Math.min(node1.x + node1.width, node2.x + node2.width) - Math.max(node1.x, node2.x));
    const yOverlap = Math.max(0, Math.min(node1.y + node1.height, node2.y + node2.height) - Math.max(node1.y, node2.y));
    return xOverlap * yOverlap;
}

export function listExpandIds(rootNode: Node, selectedNodes: string[]) {
    const result: string[] = [];
    selectedNodes.map(id => findNodeById(rootNode, id)).forEach(node => {
        while (node?.parentNode) {
            result.push(node?.parentNode.id);
            node = node.parentNode;
        }
    })

    return result;
}


export const deleteSelected = (root: Node, selectedNodes: string[]) => {
    selectedNodes.forEach(id => deleteChildNodeById(root, id))
}

export const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
}

// Mocked data for rootNode
export const rootNode: Node = {
    id: 'root',
    name: 'Root Node',
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    background: getRandomColor(),
    children: [
        {
            id: '1',
            name: 'Node 1',
            x: 20,
            y: 20,
            width: 100,
            height: 100,
            background: getRandomColor(),
            children: [
                {
                    id: '5',
                    name: 'Node 5',
                    x: 25,
                    y: 25,
                    width: 50,
                    height: 50,
                    background: getRandomColor(),
                    children: []
                }
            ]
        },
        {
            id: '2',
            name: 'Node 2',
            x: 140,
            y: 20,
            width: 200,
            height: 50,
            background: getRandomColor(),
            children: []
        },
        {
            id: '3',
            name: 'Node 3',
            x: 360,
            y: 20,
            width: 100,
            height: 100,
            background: getRandomColor(),
            children: []
        },
    ],
};