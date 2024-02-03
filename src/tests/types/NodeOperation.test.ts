import { Node, addNewNode, calculateIntersection, detachParentAndGroupNodes, findMostIntersectingSibling, findNodeById, rootNode, setupParent } from "../../types";

describe('setupParent', () => {
    test('correctly sets parentNode for each child', () => {
        const childNode = { id: 'child', x: 10, y: 10, width: 50, height: 50, background: 'red', children: [] };
        const parentNode = { id: 'parent', x: 0, y: 0, width: 100, height: 100, background: 'blue', children: [childNode] };

        const result = setupParent(parentNode);
        expect(result.children[0].parentNode).toBe(result);
    });
});


describe('detachParentAndGroupNodes', () => {
    test('groups selected nodes under a new parent', () => {
        const result = detachParentAndGroupNodes(rootNode, ['1', '2']);

        const node1 = findNodeById(result, '1')
        const node2 = findNodeById(result, '2')
        expect(node1?.parentNode!.id).toBe(node2?.parentNode!.id);
    });
});


describe('addNewNode', () => {
    test('adds a new node to the selected parent nodes', () => {
        const initialChildrenCount = rootNode.children.length;
        addNewNode(rootNode, ['root']);
        expect(rootNode.children.length).toBeGreaterThan(initialChildrenCount);
    });
});

describe('calculateIntersection', () => {
    test('calculates correct intersection area between two overlapping nodes', () => {
        const node1: Node = { id: '1', x: 0, y: 0, width: 100, height: 100, background: 'blue', children: [] };
        const node2: Node = { id: '2', x: 50, y: 50, width: 100, height: 100, background: 'red', children: [] };

        const expectedIntersectionArea = 2500; // 50x50 overlap
        const intersectionArea = calculateIntersection(node1, node2);

        expect(intersectionArea).toBe(expectedIntersectionArea);
    });

    test('returns 0 for non-overlapping nodes', () => {
        const node1: Node = { id: '1', x: 0, y: 0, width: 100, height: 100, background: 'blue', children: [] };
        const node2: Node = { id: '2', x: 100, y: 100, width: 100, height: 100, background: 'red', children: [] };

        const expectedIntersectionArea = 0; // No overlap
        const intersectionArea = calculateIntersection(node1, node2);

        expect(intersectionArea).toBe(expectedIntersectionArea);
    });
});

describe('findMostOverlappingNode', () => {
    test('findMostIntersectingSibling finds the sibling with the most overlap', () => {
        expect(findMostIntersectingSibling(node1)).toBe(node2);
    })

    test('findMostIntersectingSibling returns null when there is no overlap', () => {
        node2.x = 200;
        node2.y = 200;
        node3.x = 300;
        node3.y = 300;
        expect(findMostIntersectingSibling(node1)).toBe(null);
    });
})

// Mock Nodes
const parentNode: Node = {
    id: 'parent',
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    background: '',
    children: []
};

const node1: Node = {
    id: '1',
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    background: '',
    children: [],
    parentNode
};

const node2: Node = {
    id: '2',
    x: 50,
    y: 50,
    width: 120,
    height: 120,
    background: '',
    children: [],
    parentNode
};

const node3: Node = {
    id: '3',
    x: 80,
    y: 80,
    width: 60,
    height: 60,
    background: '',
    children: [],
    parentNode
};

parentNode.children = [node1, node2, node3];
