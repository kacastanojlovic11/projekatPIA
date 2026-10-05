import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajProizvod } from './dodaj-proizvod';

describe('DodajProizvod', () => {
  let component: DodajProizvod;
  let fixture: ComponentFixture<DodajProizvod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajProizvod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajProizvod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
