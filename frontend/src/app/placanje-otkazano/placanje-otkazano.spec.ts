import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacanjeOtkazano } from './placanje-otkazano';

describe('PlacanjeOtkazano', () => {
  let component: PlacanjeOtkazano;
  let fixture: ComponentFixture<PlacanjeOtkazano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacanjeOtkazano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacanjeOtkazano);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
