import { Component, OnInit, Input } from '@angular/core';
import { Car } from 'src/app/_models/car';
import { AuthService } from 'src/app/_services/auth.service';
import { CarService } from 'src/app/_services/car.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent implements OnInit {
  @Input() car: Car;
  @Input() isLiked = false;
  isCurrentUsersCar = false;

 constructor(
    private authService: AuthService,
    private carService: CarService,
    private alertify: AlertifyService,
    private translate: TranslateService,
    private router: Router
    ) { }

  ngOnInit() {
    this.isCurrentUsersCar = +this.authService.decodedToken.nameid === this.car.userId ? true : false;
  }

  sendLike(carId: number) {
    this.carService
      .sendLike(this.authService.decodedToken.nameid, carId)
      .subscribe(
        data => {
          this.alertify.success(this.translate.instant('YouLiked') + this.car.brandName + ' ' + this.car.modelName);
        },
        error => {
          this.alertify.error(this.translate.instant('LikeError'));
        }
      );
  }

  deleteLike() {
    this.alertify.confirm(this.translate.instant('CarLikeDelConfirm'), () => {
      this.carService
        .deleteLike(this.authService.decodedToken.nameid, this.car.id)
        .subscribe(
          next => {
            this.alertify.success(this.translate.instant('CarConfirm'));
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/favorites']);
          });
          },
          error => {
            this.alertify.error(this.translate.instant('CarDelProblem'));
          }
        );
    });
  }

  deleteCar() {
    this.alertify.confirm(this.translate.instant('CarDelConfirm'), () => {
      this.carService
        .adminDeleteCar(this.car.id)
        .subscribe(
          next => {
            this.alertify.success(this.translate.instant('CarConfirm'));
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/cars']);
            });
          },
          error => {
            this.alertify.error(this.translate.instant('CarDelProblem'));
          }
        );
    });
  }

}
