import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaulaService {
    private datosDelete: string;

    constructor(private http: Http) {}

    getTaulas() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/taula/?ordering=numTaula&actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTaula(id: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/taula/' + id.toString() + '/&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTaulaURL(url: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( url + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getTaulasRestaurant(restau: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/taula/?ordering=numTaula&actiu=true&idRestaurant=' + restau + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postTaula(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/taula/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarTaula(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/taula/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteTaula( identificador: number) {
        this.datosDelete = JSON.stringify({
            actiu: false
        });
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/taula/' + identificador.toString() + '/', this.datosDelete, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }
}
