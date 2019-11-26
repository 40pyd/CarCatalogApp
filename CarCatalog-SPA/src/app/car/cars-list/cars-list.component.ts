import { Component, OnInit } from '@angular/core';
import { Car } from '../../_models/car';
import { CarService } from '../../_services/car.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.css']
})
export class CarsListComponent implements OnInit {
  cars: Car[];
  pagination: Pagination;
  carParams: any = {};
  bsConfig: Partial<BsDatepickerConfig>;
  isCollapsed = true;
  filterForm: FormGroup;
  order: string;
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
  CountList = [
    { value: 10, display: '10' },
    { value: 20, display: '20' },
    { value: 50, display: '50' }
  ];
  IsNewList = [
    { value: 'New', display: 'New' },
    { value: 'Used', display: 'Used' },
    { value: 'All', display: 'All' }
  ];
  OrderList = [
    { value: 'low', display: 'low' },
    { value: 'high', display: 'high' }
  ];

  constructor(
    private carService: CarService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.order = '';
    (this.bsConfig = {
      dateInputFormat: 'YYYY',
      containerClass: 'theme-green'
    }),
      this.route.data.subscribe(data => {
        this.cars = data['cars'].result;
        this.pagination = data['cars'].pagination;
      });
    this.pagination.itemsPerPage = 10;
    this.createEditingForm();
    this.loadCars();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadCars();
  }

  resetFilters() {
    this.createEditingForm();
    this.isCollapsed = true;
    this.loadCars();
  }

  createEditingForm() {
    this.filterForm = this.fb.group({
      brandName: '',
      modelName: '',
      minYear: [1900, [Validators.min(1900), Validators.max(2019)]],
      maxYear: [2019, [Validators.min(1900), Validators.max(2019)]],
      minPrice: [0, [Validators.min(0), Validators.max(10000000)]],
      maxPrice: [9999999, [Validators.min(1), Validators.max(10000000)]],
      enginePower: [0.0, [Validators.min(0.0), Validators.max(12)]],
      fuel: '',
      color: '',
      body: '',
      transmission: '',
      drive: '',
      odometr: [0, [Validators.min(0.0), Validators.max(1000000)]],
      isNew: 'all'
    });
  }

  loadCars() {
    if (this.filterForm.valid) {
      this.carParams = Object.assign({}, this.filterForm.value);
      this.carParams.orderBy = this.order;
      this.carService
        .getCars(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.carParams
        )
        .subscribe(
          (res: PaginatedResult<Car[]>) => {
            this.isCollapsed = true;
            this.cars = res.result;
            this.pagination = res.pagination;
          },
          error => {
            this.alertify.error(error);
          }
        );
    }
  }
}
