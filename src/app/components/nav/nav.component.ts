import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-nav',
  standalone: true,
	imports: [
		MatToolbar,
		MatIcon,
		MatSidenavContainer,
		MatNavList,
		MatSidenav,
		MatSidenavContent,
		RouterLink,
		RouterLinkActive,
		RouterOutlet
	],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

}
