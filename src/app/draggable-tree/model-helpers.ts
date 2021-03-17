export function buildFileTree(obj: any, level: number = 0, parentId: string = '0'): any[] {
  return Object.keys(obj).reduce<any[]>((accumulator, key, idx) => {
    /**
     * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
     * By passing parentId to buildFileTree, it constructs a path of indexes which make
     * it possible find the exact sub-array that the node was grabbed from when dropped.
     */
    const id = `${parentId}/${idx}`;
    const node = {id, ...obj[key]};

    if (node.children != null) {
      node.children = buildFileTree(node.children, level + 1, node.id);
    }

    return accumulator.concat(node);
  }, []);
}
