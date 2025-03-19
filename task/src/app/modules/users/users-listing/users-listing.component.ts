import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { EncryptPasswordPipe } from '../../../pipes/encrypt-password.pipe';
import { delay } from 'rxjs/operators';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-listing',
  imports: [
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    CommonModule,
    EncryptPasswordPipe,
    InputTextModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users-listing.component.html',
  styleUrl: './users-listing.component.scss',
})
export class UsersListingComponent {
  subscription!: Subscription;
  userId: any;
  constructor(
    private userService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUsers();
  }
  searchValue: string = '';
  loader: boolean = false;
  allusers: any[] = [];
  getUsers(): void {
    this.loader = true;
    this.subscription = this.userService
      .getData()
      .pipe(delay(2000))
      .subscribe(
        (response) => {
          // console.log(response);
          this.allusers = response;
          this.filteredUsers = response;
          if (response) {
            this.loader = false;
          }
        },
        (error) => {
          console.error('Error fetching data', error);
          this.loader = false;
        }
      );
  }

  removeSearchValue() {
    this.searchValue = '';
    this.getUsers();
  }

  filteredUsers: any = [];

  searchUsers() {
    const filterValue = this.searchValue.trim().toLowerCase();
    this.filteredUsers = this.allusers.filter(
      (user) =>
        user.name.firstname.toLowerCase().includes(filterValue) ||
        user.name.lastname.toLowerCase().includes(filterValue) ||
        user.username.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue) ||
        user.address.city.toLowerCase().includes(filterValue) ||
        user.phone.toLowerCase().includes(filterValue)
    );
  }

  editUser(userId: any) {
    // console.log(userId);
    this.shareUserId(userId);
    this.router.navigate(['/users/edit-user', userId]);
  }

  confirm(event: Event, userId: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.subscription = this.userService
          .deleteUser(userId)
          .subscribe((response) => {
            if (response) {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'User deleted',
              });
            }
            // if(response.message == 'User deleted successfully'){
            //   this.getUsers();
            // }
          });
      },
      reject: () => {},
    });
  }

  shareUserId(userId: any) {
    this.userService.sharingUserId(userId);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
