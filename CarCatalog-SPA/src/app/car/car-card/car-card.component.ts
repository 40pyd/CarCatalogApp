import { Component, OnInit, Input } from '@angular/core';
import { Car } from 'src/app/_models/car';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent implements OnInit {
  @Input() car: Car;
  constructor() { }

  ngOnInit() {
  }

}
