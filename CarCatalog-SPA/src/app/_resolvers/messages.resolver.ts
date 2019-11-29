import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarService } from '../_services/car.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

  constructor(
    private carService: CarService,
    private router: Router,
    private alertify: AlertifyService,
    private translate: TranslateService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.carService.getMessages(this.authService.decodedToken.nameid, route.params['carId']).pipe(
      catchError(error => {
        this.alertify.error(this.translate.instant('DataProblem'));
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
