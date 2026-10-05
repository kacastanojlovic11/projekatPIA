import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarudzbineStamparije } from './narudzbine-stamparije';

describe('NarudzbineStamparije', () => {
  let component: NarudzbineStamparije;
  let fixture: ComponentFixture<NarudzbineStamparije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NarudzbineStamparije]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NarudzbineStamparije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
