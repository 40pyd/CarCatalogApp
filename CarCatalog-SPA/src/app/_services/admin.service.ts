import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getUsersWithRoles() {
  return this.http.get(this.baseUrl + 'users/userswithroles');
}

updateUserRoles(user: User, roles: {}) {
  return this.http.post(this.baseUrl + 'users/editRoles/' + user.userName, roles);
}

getPhotosForApproval() {
  return this.http.get(this.baseUrl + 'users/photosForModeration');
}

approvePhoto(photoId) {
  return this.http.post(this.baseUrl + 'users/approvePhoto/' + photoId, {});
}

rejectPhoto(photoId) {
  return this.http.post(this.baseUrl + 'users/rejectPhoto/' + photoId, {});
}

getCarPhotosForApproval() {
  return this.http.get(this.baseUrl + 'cars/carPhotosForModeration');
}

approveCarPhoto(photoId) {
  return this.http.post(this.baseUrl + 'cars/approvePhoto/' + photoId, {});
}

rejectCarPhoto(photoId) {
  return this.http.post(this.baseUrl + 'cars/rejectPhoto/' + photoId, {});
}

}
