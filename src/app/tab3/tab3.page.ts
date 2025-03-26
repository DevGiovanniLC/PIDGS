import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements OnInit {
  todos: Todo[] = [];
  newTodoText: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    const text = this.newTodoText.trim();
    if (!text) return;

    this.todoService.addTodo(text).subscribe((newTodo) => {
      this.todos.push(newTodo);
      this.newTodoText = '';
    });
  }

  toggleTodo(todo: Todo) {
    this.todoService.toggleTodo(todo).subscribe((updated) => {
      todo.done = updated.done;
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
    });
  }
}
