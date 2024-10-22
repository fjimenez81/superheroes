import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {ISuperhero} from "../../interfaces/superhero.interface";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
	imports: [
		MatCard,
		MatCardHeader,
		MatCardContent,
		NgOptimizedImage,
		NgStyle,
		RouterLink
	],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

	superheroes: ISuperhero[]
	constructor(private databaseService: DatabaseService) {
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
}
