import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacanjeUspesno } from './placanje-uspesno';

describe('PlacanjeUspesno', () => {
  let component: PlacanjeUspesno;
  let fixture: ComponentFixture<PlacanjeUspesno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacanjeUspesno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacanjeUspesno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
