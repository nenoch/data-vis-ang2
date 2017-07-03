import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GraphFormComponent } from './graph-form/graph-form.component';
import { MakeDroppableDirective } from './make-droppable.directive';

@NgModule({
  declarations: [
    AppComponent,
    GraphFormComponent,
    MakeDroppableDirective
  ],
  imports: [
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
