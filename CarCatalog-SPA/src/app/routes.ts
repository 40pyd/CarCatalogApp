import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CarsListComponent } from './cars-list/cars-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { AuthGuard } from './_guards/auth.guard';
import { UserEditResolver } from './_resolvers/user-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'cars', component: CarsListComponent },
      {
        path: 'user/edit',
        component: UserEditComponent,
        resolve: { user: UserEditResolver },
        canDeactivate: [PreventUnsavedChanges]
      }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
