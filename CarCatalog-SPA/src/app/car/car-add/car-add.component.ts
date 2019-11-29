import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig, YearPickerComponent } from 'ngx-bootstrap';
import { Car } from 'src/app/_models/car';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { CarService } from 'src/app/_services/car.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Photo } from 'src/app/_models/photo';
import { TranslateService } from '@ngx-translate/core';

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
  DriveList = [
    { value: 'Front', display: 'Front' },
    { value: 'Back', display: 'Back' },
    { value: 'AllWheels', display: 'AllWheels' }
  ];
  TransmissionList = [
    { value: 'Manual', display: 'Manual' },
    { value: 'Automat', display: 'Automat' },
    { value: 'Tiptronic', display: 'Tiptronic' },
    { value: 'Adaptive', display: 'Adaptive' },
    { value: 'Variator', display: 'Variator' }
  ];
  FuelList = [
    { value: 'Petrol', display: 'Petrol' },
    { value: 'Diesel', display: 'Diesel' },
    { value: 'Gas', display: 'Gas' },
    { value: 'Gibrid', display: 'Gibrid' },
    { value: 'Electro', display: 'Electro' },
    { value: 'GasPet', display: 'GasPet' }
  ];
  BodyList = [
    { value: 'Universal', display: 'Universal' },
    { value: 'Hatchback', display: 'Hatchback' },
    { value: 'Coupe', display: 'Coupe' },
    { value: 'Sedan', display: 'Sedan' },
    { value: 'Crossover', display: 'Crossover' },
    { value: 'Cabriolet', display: 'Cabriolet' }
  ];

  constructor(
    private carService: CarService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    (this.bsConfig = {
      dateInputFormat: 'YYYY',
      containerClass: 'theme-green'
    }),
      this.createAddingForm();
  }

  createAddingForm() {
    this.addingForm = this.fb.group({
      brandName: ['', Validators.required],
      modelName: ['', Validators.required],
      color: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10000000)]
      ],
      year: [
        null,
        [Validators.required, Validators.min(1900), Validators.max(2019)]
      ],
      enginePower: [0, [Validators.min(0), Validators.max(12)]],
      isNew: false,
      body: '',
      fuel: '',
      transmission: '',
      drive: '',
      odometr: [0, [Validators.min(0), Validators.max(1000000)]],
      description: ''
    });
  }

  addCar() {
    if (this.addingForm.valid) {
      this.car = Object.assign({}, this.addingForm.value);
      this.carService
        .addCar(this.authService.decodedToken.nameid, this.car)
        .subscribe(
          () => {
            this.alertify.success(this.translate.instant('CarSucess'));
            this.router.navigate([
              `cars/edit/photos/${this.carService.currentCar.id}`
            ]);
          },
          error => {
            this.alertify.error(error);
          },
          () => {
            this.router.navigate([
              `cars/edit/photos/${this.carService.currentCar.id}`
            ]);
          }
        );
    }
  }

  cancel() {
    this.cancelAdding.emit(false);
    this.router.navigate(['cars']);
  }

  updateMainPhoto(photoUrl) {
    this.car.photoUrl = photoUrl;
  }
}
