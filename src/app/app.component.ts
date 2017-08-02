import { Component } from '@angular/core';
import { Http } from '@angular/http'
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  public hideGraphCreator: Boolean = true;
  public activateLoader: Boolean = false;

  constructor(private http: Http, private iconReg: MdIconRegistry, private sanitizer: DomSanitizer){
    iconReg.addSvgIcon('barchart', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/barchart.svg'))
          .addSvgIcon('donutchart', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/donutchart.svg'))
          .addSvgIcon('linechart', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linechart.svg'))
          .addSvgIcon('scatterchart', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/scatterchart.svg'))
          .addSvgIcon('stackbarchart', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stackbarchart.svg'));
    }

  private toggleGraphCreator(bool) {
    this.hideGraphCreator = !bool;
  }

  private toggleLoader(bool) {
    this.activateLoader = bool;
  }
}
