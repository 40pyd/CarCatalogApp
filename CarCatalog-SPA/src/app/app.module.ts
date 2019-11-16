import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppComponent } from './app.component';
import { CarComponent } from './_modules/car/car.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { appRoutes } from './routes';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { CarsListComponent } from './car/cars-list/cars-list.component';
import { UserService } from './_services/user.service';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserEditResolver } from './_resolvers/user-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { CarDetailedResolver } from './_resolvers/car-detailed.resolver';
import { CarEditResolver } from './_resolvers/car-edit.resolver';
import { CarDetailedComponent } from './car/car-detailed/car-detailed.component';
import { CarCardComponent } from './car/car-card/car-card.component';
import { CarListResolver } from './_resolvers/car-list.resolver';
import { CarEditComponent } from './car/car-edit/car-edit.component';
import { CarphotoEditorComponent } from './car/carphoto-editor/carphoto-editor.component';
import { CarphotoEditResolver } from './_resolvers/carphoto-edit.resolver';
import { AuthGuard } from './_guards/auth.guard';
import { CarAddComponent } from './car/car-add/car-add.component';

export function tokenGet() {
  return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    CarsListComponent,
    UserEditComponent,
    PhotoEditorComponent,
    CarCardComponent,
    CarDetailedComponent,
    CarEditComponent,
    CarAddComponent,
    CarphotoEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxGalleryModule,
    FileUploadModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGet,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    })
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    AlertifyService,
    AuthGuard,
    UserService,
    UserEditResolver,
    CarDetailedResolver,
    CarListResolver,
    CarEditResolver,
    CarphotoEditResolver,
    PreventUnsavedChanges,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
