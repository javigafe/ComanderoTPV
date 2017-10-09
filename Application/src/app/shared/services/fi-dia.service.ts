import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class FiDiaService {

    constructor(private http: Http) {}

    getFiDia() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/fidia/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    filterGetFiDia(numeroFiDia: string, fechaFiDia: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/fidia/?ordering=-numeroFiDia&numeroFiDia=' + numeroFiDia + '&search=' + fechaFiDia + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postFiDia(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/fidia/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

}
