import {Injectable} from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { UserEditComponent } from '../user/user-edit/user-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<UserEditComponent> {
    constructor(private translate: TranslateService) {}
    canDeactivate(component: UserEditComponent) {
       if (component.editForm.dirty) {
           return confirm(this.translate.instant('Warning'));
       }
       return true;
    }
}
