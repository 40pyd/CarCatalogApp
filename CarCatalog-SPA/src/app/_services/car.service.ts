import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Car } from '../_models/car';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';

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

  getCars(
    page?,
    itemsPerPage?,
    carParams?
  ): Observable<PaginatedResult<Car[]>> {
    const paginatedResult: PaginatedResult<Car[]> = new PaginatedResult<
      Car[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (carParams != null) {
      params = params.append('minPrice', carParams.minPrice);
      params = params.append('maxPrice', carParams.maxPrice);
      params = params.append('minYear', carParams.minYear);
      params = params.append('maxYear', carParams.maxYear);
      params = params.append('modelName', carParams.modelName);
      params = params.append('brandName', carParams.brandName);
      params = params.append('orderBy', carParams.orderBy);
      params = params.append('enginePower', carParams.enginePower);
      params = params.append('fuel', carParams.fuel);
      params = params.append('color', carParams.color);
      params = params.append('body', carParams.body);
      params = params.append('transmission', carParams.transmission);
      params = params.append('drive', carParams.drive);
      params = params.append('odometr', carParams.odometr);
      params = params.append('isNew', carParams.isNew);
    }

    return this.http
      .get<Car[]>(this.baseUrl + 'cars', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
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
    return this.http.post(this.baseUrl + 'cars/' + id, car).pipe(
      map((response: any) => {
        const newCar = response;
        if (newCar) {
          localStorage.setItem('car', JSON.stringify(newCar));
          this.currentCar = newCar;
        }
      })
    );
  }

  updateCar(userId: number, id: number, car: Car) {
    return this.http.put(this.baseUrl + 'cars/' + userId + '/' + id, car).pipe(
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
    return this.http.delete(this.baseUrl + 'cars/' + userId + '/' + id);
  }

  setMainPhoto(userId: number, carId: number, id: number) {
    return this.http
      .post(
        this.baseUrl +
          'users/' +
          userId +
          '/cars/' +
          carId +
          '/' +
          id +
          '/setMain',
        {}
      )
      .pipe(
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

  getMessages(userId: number, carId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + 'cars/' + userId + '/messages/comments/' + carId
    );
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(
      this.baseUrl + 'cars/' + userId + '/messages/' + id,
      {}
    );
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post(
      this.baseUrl + 'cars/' + userId + '/messages',
      message
    );
  }
}
