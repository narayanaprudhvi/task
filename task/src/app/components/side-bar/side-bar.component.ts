import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  toggleUserManagementSubMenu: boolean = false;
  isActive: string = 'user-management';
  isCollapsed: boolean = false;
  activeSubMenu: string = 'users-listing';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedActiveSubMenu =
      sessionStorage.getItem('activeSubMenu') || 'users-listing';
    this.activeSubMenu = storedActiveSubMenu;
    this.toggleUserManagementSubMenu = true;

    this.router.events.subscribe(() => {
      this.updateActiveSubMenu();
    });

    this.updateActiveSubMenu();
  }

  updateActiveSubMenu() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('add-user')) {
      this.activeSubMenu = 'add-user';
      sessionStorage.setItem('activeSubMenu', 'add-user');
    } else if (currentUrl.includes('users-listing')) {
      this.activeSubMenu = 'users-listing';
      sessionStorage.setItem('activeSubMenu', 'users-listing');
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.toggleUserManagementSubMenu = false;
    }
  }

  setActive(menu: string) {
    if (menu !== 'user-management') {
      this.isActive = this.isActive === menu ? 'user-management' : menu;
    }
  }

  showUserManagementSubMenu() {
    if (!this.isCollapsed) {
      this.toggleUserManagementSubMenu = !this.toggleUserManagementSubMenu;
    }
  }

  setActiveSubMenu(subMenu: string) {
    this.activeSubMenu = subMenu;
    sessionStorage.setItem('activeSubMenu', subMenu);

    if (subMenu === 'add-user') {
      this.router.navigate(['/users/add-user']);
    } else {
      this.router.navigate(['/users/users-listing']);
    }
  }
}
