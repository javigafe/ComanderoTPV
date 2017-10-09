import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EmpaquetaService {
    constructor(private http: Http) {}

    getEmpaquetas() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/empaqueta/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postEmpaqueta(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/empaqueta/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarEmpaqueta(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/empaqueta/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteEmpaqueta(identificador: number) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.delete(localStorage.getItem('url') + '/empaqueta/' + identificador + '/', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

}
