import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CarsListComponent } from './cars-list/cars-list.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'cars', component: CarsListComponent }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
