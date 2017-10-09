import {Component, NgModule, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {HttpModule, Http} from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class AppComponent {

    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'es', 'cat']);
        translate.setDefaultLang('es');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|es|cat/) ? browserLang : 'es');
    }

}

