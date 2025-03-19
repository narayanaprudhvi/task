import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-no-page-found',
  imports: [RouterModule,ButtonModule],
  templateUrl: './no-page-found.component.html',
  styleUrl: './no-page-found.component.scss'
})
export class NoPageFoundComponent {

}
