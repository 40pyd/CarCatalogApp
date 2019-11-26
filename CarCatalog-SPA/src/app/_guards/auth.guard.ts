import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    private translate: TranslateService
  ) {}

  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error(this.translate.instant('NotPass'));
    this.router.navigate(['/home']);
    return false;
  }
}

