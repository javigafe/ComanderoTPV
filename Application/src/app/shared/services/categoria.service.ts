import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CategoriaService {

    constructor(private http: Http) {}

    getCategorias() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/categoria/?ordering=nom&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getSearch(buscar: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/categoria/?search=' + buscar + '&ordering=nom&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getCategoria(id: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/categoria/' + id + '/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getCategoriaURL(url: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( url, {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postCategoria(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/categoria/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarCategoria(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/categoria/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteCategoria(identificador: number) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.delete(localStorage.getItem('url') + '/categoria/' + identificador.toString() + '/', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

}
