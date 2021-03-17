import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatTreeModule} from '@angular/material/tree';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DraggableTreeComponent} from "./draggable-tree/draggable-tree.component";
import {DemoTreesDisplayComponent} from "./demo-trees-display/demo-trees-display.component";

@NgModule({
  declarations: [
    AppComponent,
    DraggableTreeComponent,
    DemoTreesDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
