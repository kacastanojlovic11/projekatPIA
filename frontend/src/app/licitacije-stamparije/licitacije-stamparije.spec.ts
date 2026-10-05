import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitacijeStamparije } from './licitacije-stamparije';

describe('LicitacijeStamparije', () => {
  let component: LicitacijeStamparije;
  let fixture: ComponentFixture<LicitacijeStamparije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicitacijeStamparije]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicitacijeStamparije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
