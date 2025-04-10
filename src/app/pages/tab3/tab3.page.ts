import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

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
  newCategoryInline: string = '';

  categories: string[] = ['Work', 'Personal', 'Study'];
  groupedTodos: { [category: string]: Todo[] } = {};
  expandedCategories: { [category: string]: boolean } = {};

  showTodoModal = false;
  showCategoryModal = false;
  isAddingInline = false;

  startX = 0;
  swipedTodoId: string | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.categories.forEach(cat => this.expandedCategories[cat] = true);
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
      this.groupTodosByCategory();
    });
  }

  groupTodosByCategory() {
    this.groupedTodos = {};
    for (const todo of this.todos) {
      const cat = todo.category || 'Uncategorized';
      if (!this.groupedTodos[cat]) {
        this.groupedTodos[cat] = [];
      }
      this.groupedTodos[cat].push(todo);
    }
  }

  addTodo() {
    const text = this.newTodoText.trim();
    const category = this.newTodoCategory.trim();
    if (!text || !category) return;

    this.todoService.addTodo(text, category).subscribe(newTodo => {
      this.todos.push(newTodo);
      this.newTodoText = '';
      this.newTodoCategory = '';
      this.groupTodosByCategory();
      this.closeTodoModal();
    });
  }

  toggleTodo(todo: Todo) {
    this.todoService.toggleTodo(todo).subscribe(updated => {
      todo.done = updated.done;
      this.groupTodosByCategory();
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== todo.id);
      this.groupTodosByCategory();
      this.swipedTodoId = null; // Cierra el swipe después de borrar
    });
  }

  toggleCategory(category: string) {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  openTodoModal() {
    this.showTodoModal = true;
  }

  closeTodoModal() {
    this.showTodoModal = false;
  }

  openCategoryModal() {
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
    this.isAddingInline = false;
  }

  startInlineCategory() {
    this.isAddingInline = true;
    this.newCategoryInline = '';
  }

  saveInlineCategory() {
    const cat = this.newCategoryInline.trim();
    if (cat && !this.categories.includes(cat)) {
      this.categories.push(cat);
      this.expandedCategories[cat] = true;
    }
    this.newCategoryInline = '';
    this.isAddingInline = false;
  }

  deleteCategory(category: string) {
    this.categories = this.categories.filter(cat => cat !== category);
    delete this.expandedCategories[category];
    this.groupTodosByCategory();
  }

  // Swipe handlers
  startSwipe(event: TouchEvent, todoId: string) {
    this.startX = event.touches[0].clientX;
  }

  moveSwipe(event: TouchEvent) {
    const currentX = event.touches[0].clientX;
    const deltaX = this.startX - currentX;
    if (deltaX > 50) {
      const target = event.target as HTMLElement;
      const id = target.closest('[data-id]')?.getAttribute('data-id') ?? null;
      this.swipedTodoId = id;
    }
  }

  endSwipe(event: TouchEvent, todoId: string) {
    const endX = event.changedTouches[0].clientX;
    const deltaX = this.startX - endX;

    if (deltaX < 30) {
      // No fue swipe real, resetear
      this.swipedTodoId = null;
    }
  }
}
