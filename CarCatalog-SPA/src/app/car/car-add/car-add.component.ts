import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Car } from 'src/app/_models/car';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { CarService } from 'src/app/_services/car.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {
  @Output() cancelAdding = new EventEmitter();
  car: Car;
  photos: Photo[] = [];
  addingForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private carService: CarService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    (this.bsConfig = {
      dateInputFormat: 'YYYY',
      containerClass: 'theme-green'
    }),
      this.createAddingForm();
  }

  createAddingForm() {
    this.addingForm = this.fb.group(
      {
        brandName: ['', Validators.required],
        modelName: ['', Validators.required],
        color: ['', Validators.required],
        price: ['', Validators.required],
        horsePowers: ['', Validators.required],
        manufactured: [null, Validators.required]
      }
    );
  }

  addCar() {
    if (this.addingForm.valid) {
      this.car = Object.assign({}, this.addingForm.value);
      this.carService.addCar(this.authService.decodedToken.nameid, this.car).subscribe(
        () => {
          this.alertify.success('Car added successfully');
          this.router.navigate([`cars/edit/photos/${this.carService.currentCar.id}`]);
        },
        error => {
          this.alertify.error(error);
        },
        () => {
          this.router.navigate([`cars/edit/photos/${this.carService.currentCar.id}`]);
        }
      );
    }

  }

  cancel() {
    this.cancelAdding.emit(false);
  }

  updateMainPhoto(photoUrl) {
    this.car.photoUrl = photoUrl;
  }
}
