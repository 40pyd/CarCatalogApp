import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CarsListComponent } from './car/cars-list/cars-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { AuthGuard } from './_guards/auth.guard';
import { UserEditResolver } from './_resolvers/user-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { CarDetailedComponent } from './car/car-detailed/car-detailed.component';
import { CarDetailedResolver } from './_resolvers/car-detailed.resolver';
import { CarListResolver } from './_resolvers/car-list.resolver';
import { CarEditComponent } from './car/car-edit/car-edit.component';
import { CarEditResolver } from './_resolvers/car-edit.resolver';
import { CarphotoEditorComponent } from './car/carphoto-editor/carphoto-editor.component';
import { CarphotoEditResolver } from './_resolvers/carphoto-edit.resolver';
import { CarAddComponent } from './car/car-add/car-add.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { ListsComponent } from './lists/lists.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'cars',
        component: CarsListComponent,
        resolve: { cars: CarListResolver }
      },
      {
        path: 'cars/:id',
        component: CarDetailedComponent,
        resolve: { car: CarDetailedResolver }
      },
      {
        path: 'addcar',
        component: CarAddComponent
      },
      {
        path: 'cars/edit/:id',
        component: CarEditComponent,
        resolve: { car: CarEditResolver }
      },
      {
        path: 'cars/edit/photos/:id',
        component: CarphotoEditorComponent,
        resolve: { car: CarphotoEditResolver }
      },
      {
        path: 'user/edit',
        component: UserEditComponent,
        resolve: { user: UserEditResolver },
        canDeactivate: [PreventUnsavedChanges]
      },
      {
        path: 'messages/:carId',
        component: MessagesComponent,
        resolve: { messages: MessagesResolver }
      },
      {
        path: 'favorites',
        component: ListsComponent,
        resolve: { cars: ListsResolver }
      },
      {
        path: 'admin',
        component: AdminPanelComponent,
        data: {roles: ['Admin', 'Moderator']}
      }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
