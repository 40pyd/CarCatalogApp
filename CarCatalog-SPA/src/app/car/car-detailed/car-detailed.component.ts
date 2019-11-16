import { OnInit, ViewChild, Component } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Car } from 'src/app/_models/car';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from 'ngx-gallery';
import { AuthService } from 'src/app/_services/auth.service';
import { CarService } from 'src/app/_services/car.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-car-detailed',
  templateUrl: './car-detailed.component.html',
  styleUrls: ['./car-detailed.component.css']
})
export class CarDetailedComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  car: Car;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  isAuthorizedUser: boolean;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.car = data['car'];
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    this.isAuthorizedUser =
    +this.authService.decodedToken.nameid === this.car.userId ? true : false;
    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });

    this.galleryOptions = [
      {
        width: '100%',
        height: '700px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '300px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 10,
        thumbnailMargin: 10
      },
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.car.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: ''
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  deleteCar() {
    this.alertify.confirm('Are you sure you want to delete this car?', () => {
      this.carService
        .deleteCar(this.authService.decodedToken.nameid, this.car.id)
        .subscribe(
          next => {
            this.alertify.success('Car was deleted successfully');
            this.router.navigate(['cars']);
          },
          error => {
            this.alertify.error('Problem on deleting the car');
          }
        );
    });
  }
}
