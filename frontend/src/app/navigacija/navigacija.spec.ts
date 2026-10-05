import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navigacija } from './navigacija';

describe('Navigacija', () => {
  let component: Navigacija;
  let fixture: ComponentFixture<Navigacija>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigacija]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navigacija);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
