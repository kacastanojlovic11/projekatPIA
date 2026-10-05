import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKorisnici } from './admin-korisnici';

describe('AdminKorisnici', () => {
  let component: AdminKorisnici;
  let fixture: ComponentFixture<AdminKorisnici>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminKorisnici]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminKorisnici);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
