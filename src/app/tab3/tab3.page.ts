import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

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

  // Categorías de ejemplo
  categories: string[] = ['Work', 'Personal', 'Study'];
  groupedTodos: { [category: string]: Todo[] } = {};

  // Flags para controlar visibilidad de modales
  showTodoModal: boolean = false;
  showCategoryModal: boolean = false;
  showNewCategoryModal: boolean = false;

  // Control de categorías expandidas/colapsadas
  expandedCategories: { [category: string]: boolean } = {};

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    // Inicialmente, todas las categorías se muestran expandidas
    this.categories.forEach(cat => this.expandedCategories[cat] = true);
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
      this.closeTodoModal();
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
      if (!this.groupedTodos[cat]) {
        this.groupedTodos[cat] = [];
      }
      this.groupedTodos[cat].push(todo);
    }
  }

  // Añade categoría desde el modal de nueva categoría
  addCategoryFromModal() {
    const cat = this.newCategory.trim();
    if (cat && !this.categories.includes(cat)) {
      this.categories.push(cat);
      this.expandedCategories[cat] = true;
      this.newCategory = '';
    }
    this.closeNewCategoryModal();
  }

  deleteCategory(category: string) {
    this.categories = this.categories.filter(cat => cat !== category);
    delete this.expandedCategories[category];
  }

  // Métodos para abrir/cerrar modales
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
    // También se cierra el modal de nueva categoría, si está abierto
    this.showNewCategoryModal = false;
  }

  openNewCategoryModal() {
    this.showNewCategoryModal = true;
  }

  closeNewCategoryModal() {
    this.showNewCategoryModal = false;
  }

  // Alterna el estado de colapso/expansión de cada categoría
  toggleCategory(category: string) {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }
}
