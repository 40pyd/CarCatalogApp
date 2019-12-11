import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { Password } from 'src/app/_models/password';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Output() cancelChange = new EventEmitter();
  password: Password;
  passwordForm: FormGroup;

  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.createPasswordForm();
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8)
        ]
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8)
        ]
      ],
    },
    { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('oldPassword').value !== g.get('newPassword').value
      ? null
      : { mismatch: true };
  }

  changePassword() {
    this.password = Object.assign({}, this.passwordForm.value);
    this.password.id = this.authService.decodedToken.nameid;
    this.userService
      .changePassword(this.password)
      .subscribe(
        next => {
          this.alertify.success(this.translate.instant('ProfileChangeSuccess'));
          this.passwordForm.reset(this.password);
          this.createPasswordForm();
        },
        error => {
          this.alertify.error(this.translate.instant('PasswordChangeProblem'));
        }
      );
  }

  cancel() {
    this.cancelChange.emit(false);
    this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user/edit']);
    });
  }

}
