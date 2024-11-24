import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrayerPage } from './prayer.page';

describe('PrayerPage', () => {
  let component: PrayerPage;
  let fixture: ComponentFixture<PrayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
