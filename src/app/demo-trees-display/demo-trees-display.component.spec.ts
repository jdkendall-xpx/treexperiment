import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTreesDisplayComponent } from './demo-trees-display.component';

describe('DemoTreesDisplayComponent', () => {
  let component: DemoTreesDisplayComponent;
  let fixture: ComponentFixture<DemoTreesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoTreesDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTreesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
