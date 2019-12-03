import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  BsDropdownModule,
  TabsModule,
  BsDatepickerModule,
  PaginationModule,
  ButtonsModule,
  CollapseModule
} from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
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
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MessagesComponent } from './messages/messages.component';
import { ListsResolver } from './_resolvers/lists.resolver';
import { ListsComponent } from './lists/lists.component';

export function tokenGet() {
  return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  };
}

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
   declarations: [
      AppComponent,
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
      CarphotoEditorComponent,
      MessagesComponent,
      ListsComponent,
      TimeAgoPipe
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      TabsModule.forRoot(),
      ButtonsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      CollapseModule.forRoot(),
      NgxGalleryModule,
      FileUploadModule,
      JwtModule.forRoot({
      config: {
        tokenGetter: tokenGet,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
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
    MessagesResolver,
    ListsResolver,
    PreventUnsavedChanges,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
