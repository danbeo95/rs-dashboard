import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiPageLayout } from './ui-page-layout';

describe('UiPageLayout', () => {
  let component: UiPageLayout;
  let fixture: ComponentFixture<UiPageLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPageLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(UiPageLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
