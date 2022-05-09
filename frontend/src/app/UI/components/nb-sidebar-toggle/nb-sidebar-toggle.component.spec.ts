import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbSidebarToggleComponent } from './nb-sidebar-toggle.component';

describe('NbSidebarToggleComponent', () => {
  let component: NbSidebarToggleComponent;
  let fixture: ComponentFixture<NbSidebarToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbSidebarToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbSidebarToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
