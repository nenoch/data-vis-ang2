import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';

import { DataService } from './data.service';

import { AppComponent } from './app.component';
import { GraphFormComponent } from './graph-form/graph-form.component';
import { GraphAreaComponent } from './graph-area/graph-area.component';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { BarchartComponent } from './barchart/barchart.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphFormComponent,
    GraphAreaComponent,
    ColumnsListComponent,
    BarchartComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    DndModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
