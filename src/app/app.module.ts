import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdIconModule } from '@angular/material';
import { DndModule } from 'ng2-dnd';

import { DataService } from './shared/data.service';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { UploadService } from './file-selector/upload.service';
import { ChartUtilsService } from './shared/chart-utils.service';
import { ConverterService } from './file-selector/converter.service';

import { AppComponent } from './app.component';
import { GraphFormComponent } from './graph-form/graph-form.component';
import { GraphAreaComponent } from './graph-area/graph-area.component';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { ErrorModalComponent } from './error-handler/error-modal/error-modal.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TabComponent} from './tab-menu/tab';
import { DataPreviewComponent } from './data-preview/data-preview.component';

import { BarchartComponent } from './barchart/barchart.component';
import { LinechartComponent } from './linechart/linechart.component';
import { DonutchartComponent } from './donutchart/donutchart.component';

import { FocusDirective } from './directives/focus.directive';
import { InfiniteScrollerDirective } from './directives/infinite-scroller.directive';

import { TableFilterPipe } from './pipes/table-filter.pipe';



@NgModule({
  declarations: [
    AppComponent,
    GraphFormComponent,
    GraphAreaComponent,
    ColumnsListComponent,
    FileSelectorComponent,
    BarchartComponent,
    DonutchartComponent,
    ErrorModalComponent,
    LinechartComponent,
    FocusDirective,
    TabMenuComponent,
    TabComponent,
    DataPreviewComponent,
    InfiniteScrollerDirective,
    TableFilterPipe
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    MdIconModule,
    DndModule.forRoot()
  ],
  providers: [
    DataService,
    UploadService,
    ErrorHandlerService,
    ChartUtilsService,
    ConverterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
