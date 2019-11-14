import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Car } from '../_models/car';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  baseUrl = environment.apiUrl;
  carPhotoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentCar: Car;
  currentCarPhotoUrl = this.carPhotoUrl.asObservable();

  constructor(private http: HttpClient) {}

  changeCarPhoto(photoUrl: string) {
    this.carPhotoUrl.next(photoUrl);
  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl + 'cars');
  }

  getCar(id: number): Observable<Car> {
    const carFromResponce = this.http.get<Car>(this.baseUrl + 'cars/' + id);
    carFromResponce.subscribe(car => {
      this.currentCar = car;
      this.changeCarPhoto(car.photoUrl);
    });
    return carFromResponce;
  }

  addCar(id: number, car: Car) {
      return this.http.post(this.baseUrl + 'cars/' + id, car);
  }

  updateCar(userId: number, id: number, car: Car) {
    return this.http.put(this.baseUrl + 'cars/' + userId + '/' + id, car)
    .pipe(
      map((response: any) => {
        const editCar = response;
        if (editCar) {
          localStorage.setItem('car', JSON.stringify(editCar.car));
          this.currentCar = car;
          this.changeCarPhoto(car.photoUrl);
        }
      })
    );
  }

  deleteCar(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'cars/' + userId + id);
  }

  setMainPhoto(userId: number, carId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/cars/' + carId + '/' + id + '/setMain',
      {}
    ).pipe(
      map((response: any) => {
        const car = response;
        if (car) {
          localStorage.setItem('car', JSON.stringify(car.car));
          this.currentCar = car.car;
          this.changeCarPhoto(this.currentCar.photoUrl);
        }
      })
    );
  }

  deletePhoto(userId: number, carId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/cars/' + carId + '/' + id
    );
  }
}

