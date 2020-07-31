import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = './assets/img/generic_avatar.png';
  picture: any;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private angularFireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService
          .getUserById(status.uid)
          .valueChanges()
          .subscribe(
            (data: User) => {
              this.user = data;
              this.croppedImage = this.user.avatar;
            },
            (err) => {
              console.error(err);
            }
          );
      },
      (err) => {
        console.error(err);
      }
    );
  }

  saveSettings(): void {
    if (this.croppedImage) {
      if (this.croppedImage !== this.user.avatar) {
        const currentPictureId = Date.now();
        const path = 'pictures/' + currentPictureId + '.jpg';
        const pictures = this.angularFireStorage
          .ref(path)
          .putString(this.croppedImage, 'data_url');
        pictures
          .then((result) => {
            this.picture = this.angularFireStorage.ref(path).getDownloadURL();

            this.picture.subscribe((p) => {
              this.userService
                .setAvatar(this.user.uid, p)
                .then(() => {
                  console.log('avatar uploaded');
                })
                .catch((err) => {
                  console.error(err);
                });
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }

    this.userService
      .editUser(this.user)
      .then(() => {})
      .catch((err) => {
        console.error(err);
        alert('Hubo un error al guardar los cambios!');
      });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
