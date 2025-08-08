import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTasks } from './search-tasks';

describe('SearchTasks', () => {
  let component: SearchTasks;
  let fixture: ComponentFixture<SearchTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
