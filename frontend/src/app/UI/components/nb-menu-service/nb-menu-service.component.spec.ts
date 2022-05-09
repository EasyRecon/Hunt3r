import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbMenuServiceComponent } from './nb-menu-service.component';

describe('NbMenuServiceComponent', () => {
  let component: NbMenuServiceComponent;
  let fixture: ComponentFixture<NbMenuServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbMenuServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbMenuServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
