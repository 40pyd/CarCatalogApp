import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-carphoto-management',
  templateUrl: './carPhoto-management.component.html',
  styleUrls: ['./carPhoto-management.component.css']
})
export class CarPhotoManagementComponent implements OnInit {
  photos: any;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getCarPhotosForApproval().subscribe((photos) => {
      this.photos = photos;
    }, error => {
      console.log(error);
    });
  }

  approvePhoto(photoId) {
    this.adminService.approveCarPhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, error => {
      console.log(error);
    });
  }

  rejectPhoto(photoId) {
    this.adminService.rejectCarPhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, error => {
      console.log(error);
    });
  }

}
