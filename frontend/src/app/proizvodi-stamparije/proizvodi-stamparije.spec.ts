import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodiStamparije } from './proizvodi-stamparije';

describe('ProizvodiStamparije', () => {
  let component: ProizvodiStamparije;
  let fixture: ComponentFixture<ProizvodiStamparije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProizvodiStamparije]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProizvodiStamparije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
