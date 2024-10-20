import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {SuperheroComponent} from "./components/superhero/superhero.component";

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'superhero/:id', component: SuperheroComponent },
	{ path: 'superhero', component: SuperheroComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];
