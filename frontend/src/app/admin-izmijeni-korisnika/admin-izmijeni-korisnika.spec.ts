import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIzmijeniKorisnika } from './admin-izmijeni-korisnika';

describe('AdminIzmijeniKorisnika', () => {
  let component: AdminIzmijeniKorisnika;
  let fixture: ComponentFixture<AdminIzmijeniKorisnika>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminIzmijeniKorisnika]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIzmijeniKorisnika);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
