import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private storageKey = 'todos';

  constructor() {}

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getStoredTodos(): Todo[] {
    const todosJson = localStorage.getItem(this.storageKey);
    return todosJson ? JSON.parse(todosJson) : [];
  }

  private setStoredTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  getTodos(): Observable<Todo[]> {
    return of(this.getStoredTodos());
  }

  addTodo(text: string, category?: string): Observable<Todo> {
    const todos = this.getStoredTodos();
    const newTodo: Todo = {
      id: this.generateUUID(),
      text,
      done: false,
      category
    };
    todos.push(newTodo);
    this.setStoredTodos(todos);
    return of(newTodo);
  }
  

  toggleTodo(todo: Todo): Observable<Todo> {
    const todos = this.getStoredTodos().map(t =>
      t.id === todo.id ? { ...t, done: !t.done } : t
    );
    this.setStoredTodos(todos);
    const updatedTodo = todos.find(t => t.id === todo.id)!;
    return of(updatedTodo);
  }

  deleteTodo(id: string): Observable<void> {
    const todos = this.getStoredTodos().filter(t => t.id !== id);
    this.setStoredTodos(todos);
    return of(void 0);
  }
}
