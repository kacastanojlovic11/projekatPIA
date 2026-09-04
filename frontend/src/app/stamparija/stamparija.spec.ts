import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stamparija } from './stamparija';

describe('Stamparija', () => {
  let component: Stamparija;
  let fixture: ComponentFixture<Stamparija>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stamparija]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stamparija);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
