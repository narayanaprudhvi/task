import { Routes } from '@angular/router';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';


export const routes: Routes = [
  { path: '', redirectTo: 'users/users-listing', pathMatch: 'full', },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },

  {path:'**', component:NoPageFoundComponent}

];
