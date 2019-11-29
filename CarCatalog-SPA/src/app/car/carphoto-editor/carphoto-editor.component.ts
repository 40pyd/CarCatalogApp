import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../_models/photo';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { FileUploader } from 'ng2-file-upload';
import { CarService } from 'src/app/_services/car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from 'src/app/_models/car';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-carphoto-editor',
  templateUrl: './carphoto-editor.component.html',
  styleUrls: ['./carphoto-editor.component.css']
})
export class CarphotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getCarPhotoChange = new EventEmitter<string>();
  car: Car;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private carService: CarService,
    private alertify: AlertifyService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.car = data['car'];
    });
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/cars/' +
        this.car.id,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        if (!this.photos) {
          this.photos = [];
        }
        this.photos.push(photo);
        if (photo.isMain) {
          this.carService.changeCarPhoto(photo.url);
          this.carService.currentCar.photoUrl = photo.url;
          localStorage.setItem(
            'car',
            JSON.stringify(this.carService.currentCar)
          );
        }
        this.alertify.success(this.translate.instant('PhotosAddSuccess'));
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.carService
      .setMainPhoto(this.authService.decodedToken.nameid, this.car.id, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.filter(p => p.isMain === true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          this.carService.changeCarPhoto(photo.url);
          this.carService.currentCar.photoUrl = photo.url;
          localStorage.setItem(
            'car',
            JSON.stringify(this.carService.currentCar)
          );
          this.alertify.success(this.translate.instant('MainChangeSuccess'));
        },
        error => {
          this.alertify.error(this.translate.instant('MainChangeProblem'));
        }
      );
  }

  deletePhoto(id: number) {
    this.alertify.confirm(this.translate.instant('PhotoDelConfirm'), () => {
      this.carService
        .deletePhoto(this.authService.decodedToken.nameid, this.car.id, id)
        .subscribe(
          () => {
            this.photos.splice(
              this.photos.findIndex(p => p.id === id),
              1
            );
            this.alertify.success(this.translate.instant('PhotoDelSuccess'));
          },
          error => {
            this.alertify.error(this.translate.instant('PhotoDelProblem'));
          }
        );
    });
  }

  cancel() {
    this.router.navigate([`cars/${this.car.id}`]);
  }
}
