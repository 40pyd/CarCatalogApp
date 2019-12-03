import { Component, OnInit } from '@angular/core';
import { Car } from '../_models/car';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { CarService } from '../_services/car.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  cars: Car[];
  pagination: Pagination;
  likesParams: string;
  userId: number;
  CountList = [
    { value: 12, display: '12' },
    { value: 24, display: '24' },
    { value: 48, display: '48' }
  ];
  constructor(
    private authService: AuthService,
    private carService: CarService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.cars = data['cars'].result;
      this.pagination = data['cars'].pagination;
    });
    this.likesParams = 'true';
  }

  loadCars() {
    this.carService
      .getCars(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParams, this.authService.decodedToken.nameid)
      .subscribe(
        (res: PaginatedResult<Car[]>) => {
          this.cars = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadCars();
  }

}
