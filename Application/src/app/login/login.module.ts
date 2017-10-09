///<reference path="../../../node_modules/@angular/forms/src/form_providers.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
