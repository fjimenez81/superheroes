import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {NgIf} from "@angular/common";
import {DatabaseService} from "../../services/database.service";
import {charactersValidator} from "../../../helpers/form.validators";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ISuperhero} from "../../interfaces/superhero.interface";
import {ActivatedRoute} from "@angular/router";

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
		FormsModule
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

	@ViewChild('img_file') inputFile!: ElementRef;

	constructor(private formBuilder: FormBuilder, private databaseService: DatabaseService, private route: ActivatedRoute) {

	}

	ngOnInit(): void {

		this.superHero_id = this.route.snapshot.paramMap.get('id');
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

			this.databaseService.openDb().then(() => {
				this.databaseService.getSuperheroe(+this.superHero_id!).then(superhero => {
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
				})
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

	/*get name(): any {
		return this.form.get('name')
	}*/

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
		} else {
			if (this.selectedFile) {


				const superHero: ISuperhero = {
					name: this.form.get('name')?.value,
					powers: this.form.get('powers')?.value,
					img: this.selectedFile
				}
				this.databaseService.openDb().then(() => {
					this.databaseService.saveSuperhero(superHero).then(id => {
						console.log(`Imagen guardada con ID: ${id}`);
					}).catch(console.error);
				})


				/*this.databaseService.saveImg(this.selectedFile).then(id => {
					console.log(`Imagen guardada con ID: ${id}`);
				}).catch(console.error);*/
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

	getImages(): void {
		this.databaseService.getImages(1).then(blob => {
			if (blob) {
				this.srcImg = URL.createObjectURL(blob);
			}
		}).catch(console.error);
	}

	removeImages() {
		this.databaseService.removeData()
	}
}
