import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  login(datos: string) {
      const header = new Headers();
      header.append('Content-Type', 'application/json');
      return this.http.post( localStorage.getItem('url') + '/rest-auth/login/', datos, {
          headers: header
      }).map(
          (response: Response) => response.json()
      );
  }

  logout() {
      const header = new Headers();
      header.append('Authorization', 'Token ' + localStorage.getItem('token'));
      return this.http.post( localStorage.getItem('url') + '/rest-auth/logout/', '', {
          headers: header
      }).map(
          (response: Response) => response.json()
      );
  }

  changePassword(datos: string) {
    const header = new Headers();
    header.append('Authorization', 'Token ' + localStorage.getItem('token'));
    return this.http.post( localStorage.getItem('url') + '/rest-auth/password/change/', datos, {
        headers: header
    }).map(
        (response: Response) => response.json()
    );
  }

  registerUser(datos: string) {
      const header = new Headers();
      header.append('Content-Type', 'application/json');
      return this.http.post( localStorage.getItem('url') + '/rest-auth/registration', datos, {
          headers: header
      }).map(
          (response: Response) => response.json()
      );
}

}
