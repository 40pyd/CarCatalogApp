import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../_models/message';
import { CarService } from '../_services/car.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  @Input() carId: number;
  newMessage: any = {};
  userId: number;

  constructor(
    private carService: CarService,
    private alertify: AlertifyService,
    private authservice: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userId = this.authservice.decodedToken.nameid;
    this.loadMessages();
  }

  loadMessages() {
    this.carService
      .getMessages(this.authservice.decodedToken.nameid, this.carId)
      .subscribe(
        (res: Message[]) => {
          this.messages = res;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.senderId = this.authservice.decodedToken.nameid;
    this.newMessage.carId = this.carId;
    this.carService
      .sendMessage(this.authservice.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    this.alertify.confirm(this.translate.instant('MesDelConfirm'), () => {
      this.carService
        .deleteMessage(id, this.authservice.decodedToken.nameid)
        .subscribe(
          () => {
            this.messages.splice(
              this.messages.findIndex(m => m.id === id),
              1
            );
            this.alertify.success(this.translate.instant('MesDelSuccess'));
          },
          error => {
            this.alertify.error(this.translate.instant('MesDelError'));
          }
        );
    });
  }
}
