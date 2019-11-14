import { Component, OnInit } from '@angular/core';
import { Car } from '../../_models/car';
import { CarService } from '../../_services/car.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.css']
})
export class CarsListComponent implements OnInit {
  cars: Car[];
  // pagination: Pagination;
  // genderList = [
  //   { value: 'male', display: 'Males' },
  //   { value: 'female', display: 'Females' }
  // ];
  // userParams: any = {};

  constructor(
    private carService: CarService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.cars = data['cars'];
      // this.pagination = data['users'].pagination;
    });

    // this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    // this.userParams.minAge = 18;
    // this.userParams.maxAge = 99;
    // this.userParams.orderBy = 'lastActive';
  }

  // pageChanged(event: any): void {
  //   this.pagination.currentPage = event.page;
  //   this.loadUsers();
  // }

  // resetFilters() {
  //   this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
  //   this.userParams.minAge = 18;
  //   this.userParams.maxAge = 99;
  //   this.loadUsers();
  // }

  // loadCars() {
  //   this.carService
  //     .getCars(
  //       // this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams
  //       )
  //     .subscribe(
  //       (
  //         // res: PaginatedResult<User[]>
  //         cars: Car[]
  //         ) => {
  //         // this.users = res.result;
  //         this.cars = cars;
  //         // this.pagination = res.pagination;
  //       },
  //       error => {
  //         this.alertify.error(error);
  //       }
  //     );
  // }

}
