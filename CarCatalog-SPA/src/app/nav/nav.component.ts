import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'ru', 'ua']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/en|ru|ua/) ? browserLang : 'en');
    } else {
      localStorage.setItem('locale', 'en');
      translate.setDefaultLang('en');
    }
  }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photoUrl => (this.photoUrl = photoUrl)
    );
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success(this.translate.instant('LoggedSuccess'));
      },
      error => {
        this.alertify.error(this.translate.instant('LoginError'));
        this.alertify.error(this.translate.instant('LoginTryAgain'));
      },
      () => {
        this.router.navigate(['/cars']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message(this.translate.instant('LoggedOut'));
    this.router.navigate(['/home']);
  }

  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
  }
}
