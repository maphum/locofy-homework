import { addNewNode, detachParentAndGroupNodes, findNodeById, rootNode, setupParent } from "../../types";

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
