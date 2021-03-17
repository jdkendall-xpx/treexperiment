import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Observable, of as observableOf} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {SelectionModel} from '@angular/cdk/collections';
import {DatabaseNode, FlatTreeNode} from '../common/common.types';
import {map} from 'rxjs/operators';
import {buildFileTree} from './model-helpers';

type DragTreeFlattener = MatTreeFlattener<DatabaseNode, FlatTreeNode, FlatTreeNode>;

@Component({
  selector: 'app-draggable-tree',
  templateUrl: 'draggable-tree.component.html',
  styleUrls: ['draggable-tree.component.scss'],
  providers: []
})
export class DraggableTreeComponent implements OnInit {

  @Input() $dataProvider: Observable<DatabaseNode[]>;
  @Input() sortable = false;
  @Output() sameOriginDrop = new EventEmitter<any>();
  @Output() differentOriginDrop = new EventEmitter<any>();

  treeControl: FlatTreeControl<FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<DatabaseNode, FlatTreeNode>;
  expansionModel = new SelectionModel<DatabaseNode>(true);

  constructor() {
    const getLevel = (node: FlatTreeNode) => node.level;
    const isExpandable = (node: FlatTreeNode) => node.expandable;
    const treeFlattener = this.createTreeFlattener(getLevel, isExpandable);

    this.treeControl = new FlatTreeControl<FlatTreeNode>(getLevel, isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
  }

  private createTreeFlattener(
              getLevel: (node: FlatTreeNode) => number,
              isExpandable: (node: FlatTreeNode) => boolean): DragTreeFlattener {
    const getChildren = (node: DatabaseNode): Observable<DatabaseNode[]> => observableOf(node.children);
    const transformer = (node: DatabaseNode, level: number) => {
      const value: FlatTreeNode = {
        expandable: !!node.children,
        level,
        name: node.name,
        type: node.type,
        id: node.id
      };
      return value;
    };

    return new MatTreeFlattener(transformer, getLevel, isExpandable, getChildren);
  }

  nodeHasChild(_: number, nodeData: FlatTreeNode): boolean {
    return nodeData.expandable;
  }

  ngOnInit(): void {
    this.$dataProvider.pipe(map(buildFileTree)).subscribe(data => this.rebuildTreeForData(data));
  }

  visibleNodes(): DatabaseNode[] {

    function addExpandedChildren(node: DatabaseNode, expanded: DatabaseNode[]): DatabaseNode[] {
      const result = [node];
      if (expanded.includes(node)) {
        for (const child of node.children) {
          result.concat(addExpandedChildren(child, expanded));
        }
      }

      return result;
    }

    return this.dataSource.data.reduce(
      (acc, node) => {
        return acc.concat(addExpandedChildren(node, this.expansionModel.selected));
      },
      []
    );
  }

  /*
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   */
  drop(event: CdkDragDrop<any>): void {
    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) {
      return;
    }

    if (event.previousContainer === event.container) {
      this.onSameOriginDrop(event);
    } else {
      this.onDifferentOriginDrop(event);
    }
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  rebuildTreeForData(data: any): void {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((expandedNode) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === expandedNode.id);
      this.treeControl.expand(node);
    });
  }

  private onDifferentOriginDrop(event: CdkDragDrop<any>): void {
    // ensure validity of drop - must be same level
    const node = event.item.data;
    this.differentOriginDrop.emit({
      item: event.item.data,
      toParent: this.findNodeParent(event.currentIndex)
    });
  }

  private onSameOriginDrop(event: CdkDragDrop<any>): void {
    this.sameOriginDrop.emit({
      item: event.item.data,
      fromParent: this.findNodeParent(event.previousIndex),
      toParent: this.findNodeParent(event.currentIndex)
    });
  }

  private findNodeParent(dropIndex: number): DatabaseNode | null {
    // Special case - items at the top of the list have no parent
    if (dropIndex === 0) {
      return null;
    }

    const visibleNodes = this.visibleNodes();
    // clamp our index to the size of visible nodes -- dropping at the end of the list will add to the bottom-most node
    const index = (dropIndex >= visibleNodes.length) ? visibleNodes.length - 1 : dropIndex;

    const nodeAtDest = visibleNodes[index];

    function findInTree(nodes: DatabaseNode[], predicate: (_: DatabaseNode) => boolean): DatabaseNode | null {
      for (const node of nodes) {
        if (predicate(node)) {
          return node;
        } else if (node.children) {
          const result = findInTree(node.children, predicate);
          if (result) {
            return result;
          }
        }
      }
    }

    return findInTree(this.dataSource.data, (n) => nodeAtDest.id === n.id);
  }

  getIconFor(type: string): string {
    switch (type) {
      case 'column':
        return 'table_rows';
      case 'table':
        return 'table_chart';
      case 'database':
        return 'filter_none';
      default:
        return 'help_outline';
    }
  }
}
