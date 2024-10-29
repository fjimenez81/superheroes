import { Injectable } from '@angular/core';
import {ISuperhero} from "../interfaces/superhero.interface";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

	private dbName = 'superHeroes';
	private dbVersion = 1;
	private db: IDBDatabase | null = null;

	public async openDb(): Promise<IDBDatabase> {
		try {
			const db = await new Promise<IDBDatabase>((resolve, reject) => {
				const request = indexedDB.open(this.dbName, this.dbVersion);

				request.onupgradeneeded = (event) => {
					this.db = (event.target as IDBOpenDBRequest).result;
					if (!this.db.objectStoreNames.contains('superheroes')) {
						this.db.createObjectStore('superheroes', { keyPath: 'id', autoIncrement: true });
					}
					console.log('Database upgrade needed and object store created');
				};

				request.onsuccess = (event) => {
					this.db = (event.target as IDBOpenDBRequest).result;
					console.log('Database open successful!');
					resolve(this.db);
				};

				request.onerror = (event) => {
					console.error('Error to open database: ', event);
					reject(new Error('Error to open database'));
				};
			});

			return db;
		} catch (error) {
			console.error('Failed to open database:', error);
			throw error;
		}
	}

	public saveSuperhero(superhero: ISuperhero): Promise<ISuperhero> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				return reject('Database not initialized');
			}
			const file: File = superhero.img
			const reader = new FileReader();
			reader.onload = () => {
				const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
				const transaction = this.db?.transaction(['superheroes'], 'readwrite');
				const store = transaction?.objectStore('superheroes');
				const request = store?.add({ name: superhero.name, powers: superhero.powers, img: blob });

				// @ts-ignore
				request.onsuccess = () => resolve(request.result as ISuperhero);
				// @ts-ignore
				request.onerror = (event) => reject('Error al guardar la imagen: ' + event);
			};

			reader.onerror = (event) => reject('Error al leer el archivo: ' + event);
			reader.readAsArrayBuffer(file);
		});
	}

	public getSuperheroe(id: number): Promise<ISuperhero> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				return reject('Database not initialized');
			}

			const transaction = this.db.transaction(['superheroes'], 'readonly');
			const store = transaction.objectStore('superheroes');
			const request = store.get(id);

			request.onsuccess = () => resolve(request.result as ISuperhero);
			request.onerror = (event) => reject('Error al obtener la imagen: ' + event);
		});
	}

	public getAllSuperheroes(offset: number = 0, limit: number = 9, nameFilter: string = ''): Promise<ISuperhero[]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db?.transaction(['superheroes'], 'readonly');
			const store = transaction?.objectStore('superheroes');
			const superheroes: ISuperhero[] = [];
			let currentIndex = 0;

			const request = store?.openCursor();
			// @ts-ignore
			request.onsuccess = (event: any) => {
				const cursor = event.target.result;
				if (cursor && superheroes.length < limit) {
					const superhero: ISuperhero = cursor.value;
					const matchesName = nameFilter
						? superhero.name.toLowerCase().includes(nameFilter.toLowerCase())
						: true;

					if (matchesName && currentIndex >= offset) {
						superhero.url = URL.createObjectURL(superhero.img);
						superheroes.push(superhero);
					}

					if (matchesName || !nameFilter) {
						currentIndex++;
					}
					cursor.continue();
				} else {
					resolve(superheroes);
				}
			};
			// @ts-ignore
			request.onerror = (event) => {
				reject('Error fetching paginated superheroes');
			};
		});
	}


	public updateSuperhero(superhero: ISuperhero) {
		const transaction = this.db?.transaction(['superheroes'], 'readwrite');
		const store = transaction?.objectStore('superheroes');

		const request = store?.put(superhero);
		// @ts-ignore
		request.onsuccess = () => {
			console.log('Superhéroe actualizado con éxito:', superhero);
		};
		// @ts-ignore
		request.onerror = (event: any) => {
			console.error('Error al actualizar el superhéroe:', event);
		};
	}

	public deleteSuperhero(id: number) {
		const transaction = this.db?.transaction(['superheroes'], 'readwrite');
		const store = transaction?.objectStore('superheroes');

		const request = store?.delete(id);

		// @ts-ignore
		request.onsuccess = () => {
			console.log('Superhéroe eliminado con éxito:', id);
		};
		// @ts-ignore
		request.onerror = (event: any) => {
			console.error('Error al eliminar el superhéroe:', event);
		};
	}
}
