import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GestionaService {

    constructor(private http: Http) {}

    getGestionats() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/gestiona/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getGestionatsByUser(userID) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/gestiona/?idUsuari=' + userID + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getGestionat(userID, restaurantID) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/gestiona/?idUsuari=' + userID + '&idRestaurant=' + restaurantID + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postGestiona(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/gestiona/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarGestiona(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/gestiona/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteGestiona(identificador: number) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.delete(localStorage.getItem('url') + '/gestiona/' + identificador + '/', {headers: header}).map(
            (response: Response) => response.json()
        );
    }
}
