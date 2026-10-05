import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajIzJson } from './dodaj-iz-json';

describe('DodajIzJson', () => {
  let component: DodajIzJson;
  let fixture: ComponentFixture<DodajIzJson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajIzJson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajIzJson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
