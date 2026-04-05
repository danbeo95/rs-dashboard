import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureCustomer } from './feature-customer';

describe('FeatureCustomer', () => {
  let component: FeatureCustomer;
  let fixture: ComponentFixture<FeatureCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureCustomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
