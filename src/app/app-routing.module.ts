import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DemoTreesDisplayComponent} from './demo-trees-display/demo-trees-display.component';


const routes: Routes = [
  { path: '', component: DemoTreesDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
