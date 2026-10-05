import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKategorije } from './admin-kategorije';

describe('AdminKategorije', () => {
  let component: AdminKategorije;
  let fixture: ComponentFixture<AdminKategorije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminKategorije]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminKategorije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
