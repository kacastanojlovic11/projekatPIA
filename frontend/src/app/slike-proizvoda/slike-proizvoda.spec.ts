import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlikeProizvoda } from './slike-proizvoda';

describe('SlikeProizvoda', () => {
  let component: SlikeProizvoda;
  let fixture: ComponentFixture<SlikeProizvoda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlikeProizvoda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlikeProizvoda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
