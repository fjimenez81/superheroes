import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {ISuperhero} from "../../interfaces/superhero.interface";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle} from "@angular/material/button-toggle";

@Component({
  selector: 'app-home',
  standalone: true,
	imports: [
		MatCard,
		MatCardHeader,
		MatCardContent,
		NgOptimizedImage,
		NgStyle,
		RouterLink,
		MatIcon,
		MatButtonToggle
	],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

	superheroes: ISuperhero[]
	constructor(private databaseService: DatabaseService, private router: Router) {
	}
	ngOnInit() {
		this.databaseService.openDb().then(() => {
			this.databaseService.getAllSuperheroes().then((superheroes: ISuperhero[])    => {
				this.superheroes = superheroes
			})
		})



	}

	getUrlImg(file: Blob): string {

		return <string>URL.createObjectURL(file)
	}

	editSuperHero(id: number):void {
		this.router.navigate([`/superhero/${id}`])
	}

	removeSuperHero(id: number):void {

		const confirm = window.confirm('Do you want remove this superhero?') as boolean
		if (confirm) {
			this.databaseService.openDb().then(() => {
				this.databaseService.deleteSuperhero(+id)
				this.databaseService.getAllSuperheroes().then((superheroes => {
					this.superheroes = superheroes
				}))
			})
		}

	}

}
