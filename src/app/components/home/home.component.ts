import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {ISuperhero} from "../../interfaces/superhero.interface";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
		MatButtonToggle,
		MatButton,
		MatInput,
		FormsModule,
		MatFormField,
		MatLabel,
		ReactiveFormsModule
	],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

	superheroes: ISuperhero[]
	currentPage: number = 0
	pageSize: number = 3
	hasMoreSuperheroes: boolean = true
	constructor(private databaseService: DatabaseService, private router: Router) { }
	async ngOnInit() {
		await this.databaseService.openDb()
		this.loadSuperheroes()
	}

	loadSuperheroes(str: string = ''): void {
		const offset = this.currentPage * this.pageSize;
		this.databaseService.getAllSuperheroes(offset, this.pageSize, str).then((superheroes: ISuperhero[])    => {
			this.superheroes = superheroes
			this.hasMoreSuperheroes = superheroes.length === this.pageSize
		})
	}

	goToNextPage(): void {
		if (this.hasMoreSuperheroes) {
			this.currentPage++
			this.loadSuperheroes()
		}
	}

	goToPreviousPage(): void {
		if (this.currentPage > 0) {
			this.currentPage--
			this.loadSuperheroes()
		}
	}

	editSuperHero(id: number):void {
		this.router.navigate([`/superhero/${id}`])
	}

	removeSuperHero(id: number):void {

		const confirm = window.confirm('Do you want remove this superhero?') as boolean
		if (confirm) {
			this.databaseService.deleteSuperhero(+id)
			this.loadSuperheroes()
		}
	}

	searchSuperhero(event: Event) {
		const input = event.target as HTMLInputElement;
		console.log(input.value)
		this.loadSuperheroes(input.value.toLowerCase())
	}
	goToCreateSuperhero() {
		this.router.navigate([`/superhero`])
	}

}
