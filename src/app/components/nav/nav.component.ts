import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatIconButton} from "@angular/material/button";

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
		RouterOutlet,
		MatToolbar,
		MatToolbarRow,
		MatIconButton,
		MatListItem
	],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
	@ViewChild('sidenav') sidenav!: MatSidenav;

	toggleSidenav() {
		this.sidenav.toggle();
	}
}
