import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Car } from '../_models/car';
import { CarService } from '../_services/car.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CarListResolver implements Resolve<Car[]> {
  pageNumber = 1;
  pageSize = 5;

  constructor(
    private carService: CarService,
    private router: Router,
    private alertify: AlertifyService,
    private translate: TranslateService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Car[]> {
    return this.carService.getCars(this.pageNumber, this.pageSize).pipe(
      catchError(error => {
        this.alertify.error(this.translate.instant('DataProblem'));
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
