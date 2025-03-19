import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    DividerModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  @Input() formData: any;

  @Input() formConfig: any;
  @Input() initialValues: any;
  @Output() formSubmit = new EventEmitter<any>();
  dynamicForm!: FormGroup;

  constructor(private fb: FormBuilder, public userService : UsersService) {}
  loader: boolean = false;
  ngOnInit(): void {
    this.createForm();
    this.recieveLoader();
    this.createForm();

    setTimeout(() => {
      if (this.initialValues) {
        this.dynamicForm.patchValue(this.initialValues);
        this.passwordStrength = this.checkPasswordStrength(this.initialValues.password);
        // console.log(this.initialValues, "000000000000000");
        // console.log(this.dynamicForm, "000000000000000");
      }
    }, 2000);
  }

  createForm(): void {
    const group: any = {};

    this.formConfig.fields.forEach((field: any) => {
      const validators = this.getValidators(field);
      group[field.name] = ['', validators];
    });
    this.dynamicForm = this.fb.group(group);
  }

  getValidators(field: any): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.validators?.includes('email')) {
      validators.push(Validators.email);
    }
    if (field.name === 'password' && field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }
    return validators;
  }

  recieveLoader(){
    this.userService.sharedLoader$.subscribe(loader => {
      this.loader = loader;
    });
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
      setTimeout(() => {
        this.loader = false;
        this.dynamicForm.reset();
      }, 1000);
    } else {
      console.log(`Form is invalid`);
    }
  }

  passwordStrength: any = '';
  passwordScore: number = 0;
  checkPasswordStrength(password: string): string {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 2) {
      return 'Weak';
    } else if (strength < 4) {
      return 'Medium';
    } else {
      return 'Strong';
    }
  }

  onPasswordKeyup(fieldName: string): void {
    const password = this.dynamicForm.get(fieldName)?.value;
    if (password) {
      this.passwordStrength = this.checkPasswordStrength(password);
      console.log('Password Strength:', this.passwordStrength);
    }
  }



}
