import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RestaurantService {

    private datosDelete: string;

    constructor(private http: Http) {}

    getRestaurantes() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/restaurant/?actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getSearch(busca: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/restaurant/?search=' + busca + 'actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getRestaurantesURL(url: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( url, {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getRestaurante(id: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/restaurant/' + id.toString() + '/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postRestaurante(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/restaurant/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarRestaurante(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/restaurant/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarRestauranteBrut(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/restaurant/' + identificador.toString() + '/?brut=false', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteRestaurante(identificador: number) {
        this.datosDelete = JSON.stringify({
            actiu: false
        });
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/restaurant/' + identificador.toString() + '/', this.datosDelete, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }
}
