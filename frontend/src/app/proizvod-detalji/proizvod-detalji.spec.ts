import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodDetalji } from './proizvod-detalji';

describe('ProizvodDetalji', () => {
  let component: ProizvodDetalji;
  let fixture: ComponentFixture<ProizvodDetalji>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProizvodDetalji]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProizvodDetalji);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
