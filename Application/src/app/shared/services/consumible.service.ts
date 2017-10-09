import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConsumibleService {

    private datosDelete: string;

    constructor(private http: Http) {}

    getConsumibles() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/consumible/?ordering=nom&actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getAllConsumibles() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/consumible/?ordering=nom&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getConsumibleURL(url: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( url, {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getSearch(busca) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/consumible/?search=' + busca + '&ordering=nom&actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postConsumible(datos) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/consumible/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarConsumible(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/consumible/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteConsumible(identificador: number) {
        this.datosDelete = JSON.stringify({
            actiu: false
        });
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/consumible/' + identificador.toString() + '/', this.datosDelete, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

}
