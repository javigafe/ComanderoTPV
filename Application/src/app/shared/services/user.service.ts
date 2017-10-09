import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

    getUsers() {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/user/?format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getUser(username: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/user/?username=' + username + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    getUserprofile(userID: string) {
        const header = new Headers();
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.get( localStorage.getItem('url') + '/userprofile/?user=' + userID + '&format=json', {headers: header}).map(
            (response: Response) => response.json()
        );
    }

    postUserprofile(data: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.post( localStorage.getItem('url') + '/userprofile/', data, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }

    editUserprofile(identificador, data: string) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Token ' + localStorage.getItem('token'));
        return this.http.patch( localStorage.getItem('url') + '/userprofile/' + identificador + '/', data, {
            headers: header
        }).map(
            (response: Response) => response.json()
        );
    }
}
