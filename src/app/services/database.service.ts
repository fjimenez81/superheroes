import { Injectable } from '@angular/core';
import {ISuperhero} from "../interfaces/superhero.interface";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

	private dbName = 'superHeroes';
	private dbVersion = 1;
	private db: IDBDatabase | null = null;

	/*constructor() {
		this.openDb();
	}*/



	public openDb(): Promise<any> {
		return new Promise((resolve, reject) => {
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
				resolve(this.db); // Resolviendo la promesa con la base de datos abierta
			};

			request.onerror = (event) => {
				console.error('Error to open database: ', event);
				reject('Error to open database: ' + (event.target as any).error?.message || event);
			};
		});
	}


	public saveImg(file: File): Promise<number> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				return reject('Database not initialized');
			}

			const reader = new FileReader();
			reader.onload = () => {
				const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
				const transaction = this.db?.transaction(['superheroes'], 'readwrite');
				const store = transaction?.objectStore('superheroes');
				const request = store?.add({img: blob });

				// @ts-ignore
				request.onsuccess = () => resolve(request.result as number);
				// @ts-ignore
				request.onerror = (event) => reject('Error al guardar la imagen: ' + event);
			};

			reader.onerror = (event) => reject('Error al leer el archivo: ' + event);
			reader.readAsArrayBuffer(file);
		});
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

	public getAllSuperheroes(): Promise<ISuperhero[]> {
		return new Promise((resolve, reject) => {
			const transaction = this.db?.transaction(['superheroes'], 'readonly');
			const store = transaction?.objectStore('superheroes');
			const superheroes: ISuperhero[] = [];


			const request = store?.openCursor();
			// @ts-ignore
			request.onsuccess = (event: any) => {
				const cursor = event.target.result;
				if (cursor) {
					cursor.value.url = URL.createObjectURL(cursor.value.img)
					superheroes.push(cursor.value);
					cursor.continue();
				} else {
					resolve(superheroes);
				}
			};
			// @ts-ignore
			request.onerror = (event: any) => {
				reject(event);
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

	public getImages(id: number): Promise<Blob | null> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				return reject('Database not initialized');
			}

			const transaction = this.db.transaction(['imagenes'], 'readonly');
			const store = transaction.objectStore('imagenes');
			const request = store.get(id);

			request.onsuccess = () => resolve(request.result?.imagen || null);
			request.onerror = (event) => reject('Error al obtener la imagen: ' + event);
		});
	}

	public removeData(): Promise<void> {
		return new Promise((resolve, reject) => {
			const deleteRequest = indexedDB.deleteDatabase(this.dbName);

			deleteRequest.onsuccess = () => {
				console.log(`Base de datos ${this.dbName} eliminada con éxito`);
				this.db = null; // Limpia la referencia a la base de datos
				resolve();
			};

			deleteRequest.onerror = (event) => {
				console.error('Error al eliminar la base de datos:', event);
				reject('Error al eliminar la base de datos');
			};

			deleteRequest.onblocked = () => {
				console.warn('La eliminación de la base de datos está bloqueada, cierre otras pestañas.');
			};
		});
	}
}
