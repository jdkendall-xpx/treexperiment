import { Component, OnInit } from '@angular/core';
import {FileDatabase} from '../common/file-database.service';

@Component({
  selector: 'app-demo-trees-display',
  templateUrl: './demo-trees-display.component.html',
  styleUrls: ['./demo-trees-display.component.scss']
})
export class DemoTreesDisplayComponent implements OnInit {
  sourceData: FileDatabase;
  destinationData: FileDatabase;

  constructor() {
    this.sourceData = new FileDatabase('source');
    this.destinationData = new FileDatabase('destination');
  }

  ngOnInit(): void {
  }

  onDestinationAdd(event) {
    console.log("add!");
    console.log(event);
  }

  onDestinationMove(event) {
    console.log("move!");
    console.log(event);
  }

  onDestinationDragBack(event) {
    console.log("Option dragged back!");
    console.log(event);
  }
}
