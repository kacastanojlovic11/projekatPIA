import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArhivaProizvoda } from './arhiva-proizvoda';

describe('ArhivaProizvoda', () => {
  let component: ArhivaProizvoda;
  let fixture: ComponentFixture<ArhivaProizvoda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArhivaProizvoda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArhivaProizvoda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
