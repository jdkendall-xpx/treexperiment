/** File node data with possible child nodes. */
export interface DatabaseNode {
  id: string;
  name: string;
  type: string;
  children?: DatabaseNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  id: string;
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}
