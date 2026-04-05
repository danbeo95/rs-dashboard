import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePortDetail } from './feature-port-detail';

describe('FeaturePortDetail', () => {
  let component: FeaturePortDetail;
  let fixture: ComponentFixture<FeaturePortDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePortDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePortDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
