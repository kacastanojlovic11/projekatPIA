import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatistika } from './admin-statistika';

describe('AdminStatistika', () => {
  let component: AdminStatistika;
  let fixture: ComponentFixture<AdminStatistika>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatistika]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatistika);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
