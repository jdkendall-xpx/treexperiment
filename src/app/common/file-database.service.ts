import {BehaviorSubject} from "rxjs";
import {DatabaseNode} from './common.types';
import {tables} from "./example-data";

export class FileDatabase {
  dataChange = new BehaviorSubject<DatabaseNode[]>([]);

  constructor(table: string) {
    this.initialize(table);
  }

  get data(): DatabaseNode[] {
    return this.dataChange.value;
  }

  initialize(table: string) {
    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(JSON.parse(JSON.stringify(tables[table])), 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: any, level: number, parentId: string = '0'): any[] {
    return Object.keys(obj).reduce<any[]>((accumulator, key, idx) => {
      /**
       * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
       * By passing parentId to buildFileTree, it constructs a path of indexes which make
       * it possible find the exact sub-array that the node was grabbed from when dropped.
       */
      const id = `${parentId}/${idx}`;
      const node = {id, ...obj[key]};

      console.log(node);
      if (node.children != null) {
        node.children = this.buildFileTree(node.children, level + 1, node.id);
      }

      return accumulator.concat(node);
    }, []);
  }
}
