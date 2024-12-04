import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { PrayerPage } from './prayer.page';

describe('PrayerPage', () => {
  let component: PrayerPage;
  let fixture: ComponentFixture<PrayerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrayerPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});