import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig, YearPickerComponent } from 'ngx-bootstrap';
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
  DriveList = [
    { value: 'front', display: 'Front wheels' },
    { value: 'back', display: 'Back wheels' },
    { value: 'all', display: 'All wheels' }
  ];
  TransmissionList = [
    { value: 'manual', display: 'Manual' },
    { value: 'automat', display: 'Automat' },
    { value: 'tiptronic', display: 'Tiptronic' },
    { value: 'adaptive', display: 'Adaptive' },
    { value: 'variator', display: 'Variator' }
  ];
  FuelList = [
    { value: 'petrol', display: 'Petrol' },
    { value: 'diesel', display: 'Diesel' },
    { value: 'gas', display: 'Gas' },
    { value: 'gibrid', display: 'Gibrid' },
    { value: 'electro', display: 'Electro' },
    { value: 'gas/petrol', display: 'Gas/Petrol' }
  ];
  BodyList = [
    { value: 'universal', display: 'Universal' },
    { value: 'hatchback', display: 'Hatchback' },
    { value: 'coupe', display: 'Coupe' },
    { value: 'sedan', display: 'Sedan' },
    { value: 'crossover', display: 'Crossover' },
    { value: 'cabriolet', display: 'Cabriolet' }
  ];

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
      enginePower: [0, [Validators.min(0.1), Validators.max(12)]],
      isNew: false,
      body: '',
      fuel: '',
      transmission: '',
      drive: '',
      odometr: [0, [Validators.min(0.1), Validators.max(1000000)]],
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
            this.alertify.success('Car added successfully');
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
