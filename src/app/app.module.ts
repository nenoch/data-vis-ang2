import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';

import { DataService } from './data.service';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { UploadService } from './upload.service';
import { ChartUtilsService } from './chart-utils.service';
import { GraphService } from './graph-area/graph.service';

import { AppComponent } from './app.component';
import { GraphFormComponent } from './graph-form/graph-form.component';
import { GraphAreaComponent } from './graph-area/graph-area.component';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { ErrorModalComponent } from './error-handler/error-modal/error-modal.component';

import { BarchartComponent } from './barchart/barchart.component';
import { LinechartComponent } from './linechart/linechart.component';

import { GraphDirective } from './graph-area/graph.directive';



@NgModule({
  declarations: [
    AppComponent,
    GraphFormComponent,
    GraphAreaComponent,
    ColumnsListComponent,
    FileSelectorComponent,
    ErrorModalComponent,
    GraphDirective,
    BarchartComponent,
    LinechartComponent
  ],
  entryComponents: [
    BarchartComponent,
    LinechartComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    DndModule.forRoot()
  ],
  providers: [
    DataService,
    UploadService,
    ErrorHandlerService,
    ChartUtilsService,
    GraphService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
