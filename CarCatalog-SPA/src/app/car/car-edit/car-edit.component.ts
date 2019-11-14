import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CarService } from 'src/app/_services/car.service';
import { Car } from 'src/app/_models/car';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  car: Car;
  carPhotoUrl: string;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private carService: CarService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.car = data['car'];
    });
    this.carService.currentCarPhotoUrl.subscribe(photoUrl => this.carPhotoUrl = photoUrl);
  }

  updateCar() {
    this.carService.currentCarPhotoUrl.subscribe(photoUrl => this.carPhotoUrl = photoUrl);
    this.carService
      .updateCar(this.authService.decodedToken.nameid, this.car.id, this.car)
      .subscribe(
        next => {
          this.alertify.success('Car updated successfully');
          this.editForm.reset(this.car);
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  updateMainPhoto(photoUrl) {
    this.car.photoUrl = photoUrl;
  }
}

