import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePort } from './feature-port';

describe('FeaturePort', () => {
  let component: FeaturePort;
  let fixture: ComponentFixture<FeaturePort>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePort],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePort);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
