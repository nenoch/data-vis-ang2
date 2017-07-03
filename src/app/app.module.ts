import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GraphFormComponent } from './graph-form/graph-form.component';
import { MakeDroppableDirective } from './make-droppable.directive';

import { GraphAreaComponent } from './graph-area/graph-area.component';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { MakeDraggableDirective } from './make-draggable.directive';

@NgModule({
  declarations: [
    AppComponent,
    GraphFormComponent,
    MakeDroppableDirective,
    GraphAreaComponent,
    ColumnsListComponent,
    MakeDraggableDirective
  ],
  imports: [
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
