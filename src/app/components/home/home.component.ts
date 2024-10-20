import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {ISuperhero} from "../../interfaces/superhero.interface";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
		constructor(private databaseService: DatabaseService) {
		}
		ngOnInit() {
			this.databaseService.openDb().then(() => {
				this.databaseService.getAllSuperheroes().then((superheroes: ISuperhero[])    => {
					console.log(superheroes)
				})
			})



		}
}
