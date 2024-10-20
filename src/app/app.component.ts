import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {SuperheroComponent} from "./components/superhero/superhero.component";
import {NavComponent} from "./components/nav/nav.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, HomeComponent, SuperheroComponent, NavComponent, RouterLink, RouterLinkActive],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'SUPERHEROES';
}
