import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {NgIf, NgStyle} from "@angular/common";
import {DatabaseService} from "../../services/database.service";
import {charactersValidator} from "../../../helpers/form.validators";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ISuperhero} from "../../interfaces/superhero.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {UppercaseDirective} from "../../directives/uppercase.directive";

@Component({
	selector: 'app-superhero',
	standalone: true,
	providers: [FormBuilder, DatabaseService],
	imports: [
		ReactiveFormsModule,
		NgIf,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		NgStyle,
		UppercaseDirective
	],
	templateUrl: './superhero.component.html',
	styleUrl: './superhero.component.css'
})
export class SuperheroComponent implements OnInit {

	nameControl:  FormControl = new FormControl('')
	imgControl: FormControl = new FormControl([null])
	powersControl: FormControl = new FormControl('')

	form: FormGroup = this.formBuilder.group({
		name: this.nameControl,
		img: new FormControl([null]),
		powers: this.powersControl
	});

	selectedFile: File |undefined
	srcImg: string
	superHero_id: string | null
	urlImage: string



	nameFile = signal<string>('')

	btnDisable = signal('false')

	title = signal('Create')

	@ViewChild('img_file') inputFile!: ElementRef;

	constructor(private formBuilder: FormBuilder, private databaseService: DatabaseService,
				private activatedRoute: ActivatedRoute, private router: Router) {

	}

	async ngOnInit() {
		await this.databaseService.openDb()

		this.superHero_id = this.activatedRoute.snapshot.paramMap.get('id');
		if (!this.superHero_id) {
			this.nameControl = new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50),
				charactersValidator
			]);
			this.imgControl = new FormControl([null], [
				Validators.required
			]);
			this.powersControl = new FormControl('', [
				Validators.required
			]);
			this.form = this.formBuilder.group({
				name: this.nameControl,
				img: this.imgControl,
				powers: this.powersControl
			});
		} else {

			this.databaseService.getSuperheroe(+this.superHero_id!).then(superhero => {
				if (superhero) {
					this.title.set('Edit')
					this.urlImage = URL.createObjectURL(superhero.img);
					this.nameControl = new FormControl(superhero.name, [
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(50),
						charactersValidator
					]);
					this.imgControl = new FormControl([null], [
						Validators.required
					]);
					this.powersControl = new FormControl(superhero.powers, [
						Validators.required
					]);
					this.form = this.formBuilder.group({
						name: this.nameControl,
						img: this.imgControl,
						powers: this.powersControl
					});
					this.selectedFile = superhero.img
					this.urlImage = URL.createObjectURL(superhero.img)
				} else {
					this.router.navigate([`/superhero`])
				}

			})
		}
	}
	onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input?.files[0]
			this.selectedFile = file
			this.nameFile.set(file.name)

		}
	}

	onSubmit(): void {
		this.btnDisable.set('')
		if (this.superHero_id) {

			const superHero: ISuperhero = {
				id: +this.superHero_id,
				name: this.form.get('name')?.value,
				powers: this.form.get('powers')?.value,
				img: this.selectedFile!
			}

			this.databaseService.updateSuperhero(superHero)
			this.btnDisable.set('false')
			this.router.navigate([`/`])
		} else {
			if (this.selectedFile) {

				const superHero: ISuperhero = {
					name: this.form.get('name')?.value,
					powers: this.form.get('powers')?.value,
					img: this.selectedFile
				}
				this.databaseService.saveSuperhero(superHero).then(id => {
					console.log(`Imagen guardada con ID: ${id}`);
					this.router.navigate([`/`])
				}).catch(console.error);
			}
		}
	}

	openFile(): void {
		this.inputFile.nativeElement.click()
	}

	getSuperheroe() {
		this.databaseService.getSuperheroe(1).then(res => {
			console.log(res)
		}).catch(console.error);
	}

	getAllSuperheroes() {
		this.databaseService.getAllSuperheroes().then(res => {
			console.log(res)
		}).catch(console.error);
	}

}
