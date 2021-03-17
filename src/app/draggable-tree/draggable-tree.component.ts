import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Observable, of as observableOf} from 'rxjs';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {SelectionModel} from '@angular/cdk/collections';
import {FileNode, FlatTreeNode} from '../common/common.types';
import {FileDatabase} from "../common/file-database.service";

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-draggable-tree',
  templateUrl: 'draggable-tree.component.html',
  styleUrls: ['draggable-tree.component.scss'],
  providers: []
})
export class DraggableTreeComponent implements OnInit {

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);
  validateDrop = false;
  database: FileDatabase;
  @Input() table: string;
  isDroppable = (drag: CdkDrag<FileNode>, drop: CdkDropList<FileNode[]>) => {
    return true; // return drop.data === this.dataSource.data;
  }

  ngOnInit(): void {
    this.database = new FileDatabase(this.table);
    this.database.dataChange.subscribe(data => this.rebuildTreeForData(data));
  }

  transformer: (node: FileNode, level: number) => FlatTreeNode = (node: FileNode, level: number) => {
    const value: FlatTreeNode = {
      expandable: !!node.children,
      level,
      name: node.name,
      type: node.type,
      id: node.id
    };
    return value;
  }

  hasChild = (_: number, _nodeData: FlatTreeNode) => _nodeData.expandable;

  // DRAG AND DROP METHODS
  /**
   * This constructs an array of nodes that matches the DOM
   */
  visibleNodes(): FileNode[] {
    const result = [];

    function addExpandedChildren(node: FileNode, expanded: string[]): void {
      result.push(node);
      if (expanded.includes(node.id)) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }

    this.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    return result;
  }

  /*
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   */
  drop(event: CdkDragDrop<any>): void {
    console.log('origin index:', event.previousIndex);
    console.log('destination index:', event.currentIndex);

    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) {
      return;
    }

    // Skip drops on same container
    if (event.previousContainer === event.container) {
      return;
    }

    const dropLevel = this.findDropLevel(event);

    // ensure validity of drop - must be same level
    const node = event.item.data;
    console.log('dropLevel: ', dropLevel);
    console.log('node level: ', node.level);
    if (dropLevel !== node.level) {
      alert('Items can only be moved within the same level.');
      return;
    }

    // // rebuild tree with mutated data
    // this.rebuildTreeForData(changedData);
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  rebuildTreeForData(data: any): void {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === id);
      this.treeControl.expand(node);
    });
  }

  private _getLevel = (node: FlatTreeNode) => node.level;

  private _isExpandable = (node: FlatTreeNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

  private findDropLevel(event: CdkDragDrop<string[]>) {
    const visibleNodes = this.visibleNodes();
    const index = (event.currentIndex >= visibleNodes.length) ? visibleNodes.length - 1 : event.currentIndex;

    const nodeAtDest = visibleNodes[index];
    return this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id).level;
  }

  private getParentNode(node: FlatTreeNode): FlatTreeNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  onDropEnter($event: CdkDragDrop<string[]>): boolean {
    return $event.container === $event.previousContainer;
  }
}
