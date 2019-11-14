import { OnInit, ViewChild, Component } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Car } from 'src/app/_models/car';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from 'ngx-gallery';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-car-detailed',
  templateUrl: './car-detailed.component.html',
  styleUrls: ['./car-detailed.component.css']
})
export class CarDetailedComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  car: Car;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  isAuthorizedUser: boolean;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.car = data['car'];
    });
    this.isAuthorizedUser = (+this.authService.decodedToken.nameid === this.car.userId) ? true : false;
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
}
