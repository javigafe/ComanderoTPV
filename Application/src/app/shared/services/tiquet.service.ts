import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TiquetService {

    private datosDelete: string;

    constructor(private http: Http) {}

    getTiquets() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/tiquet/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTiquetsPendents(idRestauramt: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/tiquet/?estat=2&idRestaurant=' + idRestauramt +'&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTiquet(id: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/tiquet/' + id.toString() + '/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTiquetsFiDia(idFidia: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/tiquet/?idFidia=' + idFidia.toString() + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    busquedaTiquet(numero: number, data: string, client, restaurant: number, estat: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/tiquet/?search=' + data + '&numeroTiquet=' +
            numero + '&idClient=' + client + '&idRestaurant=' + restaurant + '&estat=' + estat + '&ordering=-dataHora&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postTiquet(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/tiquet/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarTiquet(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/tiquet/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteTiquet(identificador: number) {
        this.datosDelete = JSON.stringify({
            estat: 3
        });
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/tiquet/' + identificador.toString() + '/', this.datosDelete, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

}
