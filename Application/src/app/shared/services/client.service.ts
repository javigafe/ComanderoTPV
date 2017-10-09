import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientService {
    private datosDelete: string;

    constructor(private http: Http) {}

    getClients() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/client/?actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getSearch(busca: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/client/?search=' + busca + '&actiu=true&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getClient(id: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/client/' + id.toString() + '/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postClient(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/client/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarClient(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/client/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteClient(identificador: number) {
        this.datosDelete = JSON.stringify({
            actiu: false
        });
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/client/' + identificador.toString() + '/', this.datosDelete, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }
}
