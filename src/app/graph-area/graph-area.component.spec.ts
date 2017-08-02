import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAreaComponent } from './graph-area.component';

xdescribe('GraphAreaComponent', () => {
  let component: GraphAreaComponent;
  let fixture: ComponentFixture<GraphAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
