
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],

  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements OnInit {
  todos: Todo[] = [];
  newTodoText: string = '';
  newTodoCategory: string = '';
  newCategory: string = '';

  categories: string[] = ['Trabajo', 'Personal', 'Estudio']; // Puedes hacer esto dinámico también
  groupedTodos: { [category: string]: Todo[] } = {};

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
      this.groupTodosByCategory();
    });
  }

  addTodo() {
    const text = this.newTodoText.trim();
    const category = this.newTodoCategory.trim();

    if (!text || !category) return;

    this.todoService.addTodo(text, category).subscribe((newTodo) => {
      this.todos.push(newTodo);
      this.newTodoText = '';
      this.newTodoCategory = '';
      this.groupTodosByCategory();
    });
  }

  toggleTodo(todo: Todo) {
    this.todoService.toggleTodo(todo).subscribe((updated) => {
      todo.done = updated.done;
      this.groupTodosByCategory();
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
      this.groupTodosByCategory();
    });
  }

  groupTodosByCategory() {
    this.groupedTodos = {};
    for (const todo of this.todos) {
      const cat = todo.category || 'Sin categoría';
      if (!this.groupedTodos[cat]) this.groupedTodos[cat] = [];
      this.groupedTodos[cat].push(todo);
    }
  }

  addCategory() {
    const cat = this.newCategory.trim();
    if (cat && !this.categories.includes(cat)) {
      this.categories.push(cat);
      this.newCategory = '';
    }
  }
}
