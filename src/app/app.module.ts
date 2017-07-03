import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphAreaComponent } from './graph-area/graph-area.component';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { MakeDraggableDirective } from './make-draggable.directive';


@NgModule({
  declarations: [
    AppComponent,
    GraphAreaComponent,
    ColumnsListComponent,
    MakeDraggableDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
