import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../services/users.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-edit-user',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DynamicFormComponent,
  ],
  providers: [MessageService],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  editUserForm: FormGroup;
  userId: any;
  private subscription!: Subscription;
  constructor(
    public fb: FormBuilder,
    public userService: UsersService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    // this.userId = this.route.snapshot.paramMap.get('id');
  }

  updateUserFormConfig = {
    fields: [
      { name: 'username', type: 'text', label: 'Username', required: true },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        validators: ['email'],
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        required: true,
        minLength: 6,
      },
    ],
  };

  updateUserData: any;
  ngOnInit() {
    this.updateUserData = this.editUserForm.value;
    this.getUserId();
    // if (this.userId == null) {
    //   this.userId = this.route.snapshot.paramMap.get('id');
    // }
    setTimeout(() => {
      if (this.userId == '') {
        // alert('1111111');
        this.userId = this.route.snapshot.paramMap.get('id');
      } else {
        // alert('22222222');
        this.userId = this.userId;
      }
      this.getuserById();
      // this.loadUserData();
    }, 1000);
  }

  getUserId() {
    this.userService.sharedData$.subscribe((data: string) => {
      this.userId = data;
      console.log(this.userId, 'user id from users listing component');
    });
  }

  user: any[] = [];
  newUpdateUser: any = [];

  getuserById() {
    this.subscription = this.userService
      .getUserById(this.userId)
      .subscribe((user: any) => {
        const { username, email, password } = user;
        this.newUpdateUser = { username, email, password };
        this.editUserForm.patchValue({
          username: this.newUpdateUser.username,
          email: this.newUpdateUser.email,
          password: this.newUpdateUser.password,
        });
        if (user) {
          this.loader = false;
        }
        // console.log(this.newUpdateUser);
      });
  }

  sendLoaderData(){
    this.userService.sharingLoader(this.loader)
  }

  loader: boolean = false;
  onSubmit(userData: any) {
    this.loader = true;
    this.sendLoaderData();
    setTimeout(() => {
      // const userData = this.editUserForm.value;
      this.subscription = this.userService
        .updateUser(this.userId, userData)
        .subscribe(
          (response) => {
            // console.log(response);
            if (response) {
              this.loader = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User updated successfully',
              });
              this.editUserForm.reset();
            }
            setTimeout(() => {
              this.router.navigate(['/users/users-listing']);
            }, 1500);
          },
          (error) => {
            this.loader = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'failed to update user',
            });
          }
        );
    }, 2000);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
