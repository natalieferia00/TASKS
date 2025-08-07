import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListReusable } from './todo-list-reusable';

describe('TodoListReusable', () => {
  let component: TodoListReusable;
  let fixture: ComponentFixture<TodoListReusable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListReusable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListReusable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
