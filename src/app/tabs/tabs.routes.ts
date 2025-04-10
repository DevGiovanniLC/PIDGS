import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../pages/tab1/components/reminder/reminder.component').then((m) => m.ReminderComponent),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../pages/tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        loadComponent: () =>
          import('../pages/tab1/components/reminder/reminder.component').then((m) => m.ReminderComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
