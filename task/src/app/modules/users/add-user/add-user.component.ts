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
import { Subscription } from 'rxjs';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-add-user',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DynamicFormComponent
  ],
  providers: [MessageService],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  addUserForm: FormGroup;
  subscription!: Subscription;
  constructor(
    public fb: FormBuilder,
    public userService: UsersService,
    private messageService: MessageService
  ) {
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  addUserData :any[] = [];
  ngOnInit(){
    this.addUserData = this.addUserForm.value;
    this.loader = false;
  }

  addUserFormConfig = {
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
      }
    ],
  };

  loader: boolean = false;
  onSubmit(userData:any) {
    this.loader = true;
    this.sendLoaderData();
    // const userData = this.addUserForm.value;
    this.subscription = this.userService.addUser(userData).subscribe(
      (response) => {
        // console.log(response);
        if (response) {
          this.loader = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User added successfully',
          });
          this.addUserForm.reset();
        }
      },
      (error) => {
        this.loader = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'failed to add user',
        });
      }
    );
  }

  sendLoaderData(){
    this.userService.sharingLoader(this.loader)
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
