import {Component, NgModule, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AuthenticationService } from './../../app/shared/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ AuthenticationService ]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class LoginComponent implements OnInit {

    loading: boolean;
    name: string;
    url: string;
    password: string;
    error: number;
    // 0 no error
    // 1 username buit
    // 2 password buit
    // 3 url buit
    // 4 error login son server

    constructor(public router: Router, private newAuthenticationService: AuthenticationService ) {}

    ngOnInit() {
        this.loading = false;
        this.name = '';
        this.url = '';
        this.password = '';
    }

    onLoggedin() {
        this.loading = true;
        this.error = 0;
        if ((this.name === '') || (this.name === null)) {
            this.error = 1;
            this.loading = false;
        } else if ((this.password === '') || (this.password === null)) {
            this.error = 2;
            this.loading = false;
        } else if ((this.url === '') || (this.url === null)) {
            this.error = 3;
            this.loading = false;
        }
        if (this.error === 0) {
            localStorage.setItem('url', this.url);
            const tempLogin = JSON.stringify({
                username: this.name,
                password: this.password
            });
            this.newAuthenticationService.login(tempLogin).subscribe(
                (data) => (
                    this.loginSucces(data),
                    this.loading = false
                ),
                (error) => (
                    this.error = 4,
                    this.loading = false
                ),
                () => console.log('OK Login')
            );
        }
    }

    loginSucces(token) {
        localStorage.setItem('usuario', this.name);
        localStorage.setItem('token', token.key);
        localStorage.setItem('isLoggedin', 'true');
        window.location.assign('../');
    }
}
