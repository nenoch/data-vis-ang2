import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsListComponent } from './columns-list.component';

xdescribe('ColumnsListComponent', () => {
  let component: ColumnsListComponent;
  let fixture: ComponentFixture<ColumnsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
