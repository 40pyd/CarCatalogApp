import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CarService } from 'src/app/_services/car.service';
import { Car } from 'src/app/_models/car';
import { AuthService } from 'src/app/_services/auth.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {
  @Output() cancelEditing = new EventEmitter();
  car: Car;
  carPhotoUrl: string;
  bsConfig: Partial<BsDatepickerConfig>;
  editingForm: FormGroup;
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
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private carService: CarService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    (this.bsConfig = {
      dateInputFormat: 'YYYY',
      containerClass: 'theme-green'
    }),
      this.route.data.subscribe(data => {
        this.car = data['car'];
      });
    this.carService.currentCarPhotoUrl.subscribe(
      photoUrl => (this.carPhotoUrl = photoUrl)
    );
    this.createEditingForm();
  }

  updateCar() {
    this.carService.currentCarPhotoUrl.subscribe(
      photoUrl => (this.carPhotoUrl = photoUrl)
    );
    this.car = Object.assign({}, this.editingForm.value);
    this.carService
      .updateCar(this.authService.decodedToken.nameid, this.car.id, this.car)
      .subscribe(
        next => {
          this.alertify.success(this.translate.instant('CarUpdateSuccess'));
          this.createEditingForm();
          this.router.navigate([`cars/${this.car.id}`]);
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  updateMainPhoto(photoUrl) {
    this.car.photoUrl = photoUrl;
  }

  createEditingForm() {
    this.editingForm = this.fb.group({
      id: this.car.id,
      brandName: [this.car.brandName, Validators.required],
      modelName: [this.car.modelName, Validators.required],
      year: [this.car.year, [Validators.min(1900), Validators.max(2019)]],
      price: [
        this.car.price,
        [Validators.required, Validators.min(0), Validators.max(10000000)]
      ],
      enginePower: [
        this.car.enginePower != null ? this.car.enginePower : 0.0,
        [Validators.min(0.0), Validators.max(12)]
      ],
      fuel: this.car.fuel != null ? this.car.fuel : '',
      color: [
        this.car.color != null ? this.car.color : '',
        Validators.required
      ],
      body: this.car.body != null ? this.car.body : '',
      transmission: this.car.transmission != null ? this.car.transmission : '',
      drive: this.car.drive != null ? this.car.drive : '',
      odometr: [
        this.car.odometr != null ? this.car.odometr : 0,
        [Validators.min(0.0), Validators.max(1000000)]
      ],
      isNew: this.car.isNew === true ? true : false,
      description: this.car.description
    });
  }

  cancel() {
    this.cancelEditing.emit(false);
    this.router.navigate([`cars/${this.car.id}`]);
  }
}
