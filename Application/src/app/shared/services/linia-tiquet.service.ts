import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LiniaTiquetService {

    constructor(private http: Http) {}

    getLiniaTiquets() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/liniatiquet/?ordering=dataHora&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getLiniaTiquetsTaula(idTaula: number, idTiquet: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/liniatiquet/?ordering=dataHora&idTaula=' + idTaula.toString() + '&idTiquet=' + idTiquet.toString() + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getLiniasTiquet(idTiquet: number) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/liniatiquet/?idTiquet=' + idTiquet.toString() + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postLiniaTiquet(datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/liniatiquet/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editarLiniaTiquet(identificador: number, datos: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch(localStorage.getItem('url') + '/liniatiquet/' + identificador.toString() + '/', datos, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    deleteLiniaTiquet(identificador: number) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.delete(localStorage.getItem('url') + '/liniatiquet/' + identificador + '/', {headers: header}).map(
            (response: Response) => response.json()
        );
    }
}
