import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
cars: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCars();
  }

  getCars() {
    this.http.get('http://localhost:5000/api/cars').subscribe(response => {
      this.cars = response;
    }, error => {
      console.log(error);
    });
  }

}
