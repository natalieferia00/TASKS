import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarList } from './calendar-list';

describe('CalendarList', () => {
  let component: CalendarList;
  let fixture: ComponentFixture<CalendarList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
