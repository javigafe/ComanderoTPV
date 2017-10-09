import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { UserService } from './../../../../../app/shared/services/user.service';
import { GestionaService } from './../../../../../app/shared/services/gestiona.service';
import { AuthenticationService } from './../../../../../app/shared/services/authentication.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-trabajador',
  templateUrl: './add-trabajador.component.html',
  styleUrls: ['./add-trabajador.component.scss'],
  providers: [RestaurantService, UserService, GestionaService, AuthenticationService, TranslateService]
})


@NgModule({
    imports: [
        HttpModule,
    ]
})

export class AddTrabajadorComponent implements OnInit {
    usuario: string;
    pass1: string;
    pass2: string;
    nombre: string;
    dni: string;
    carec: number;
    userActiu;
    restaurantActiu;
    restaurants = [];
    usuaris = [];
    disponibilitatUser: number;
    gestionats = [];
    errorText: string;
    succes: string;
    errorTextUser: string;
    succesUser: string;

  constructor(private newRestaurantService: RestaurantService, private newUserService: UserService, private newGestionaService: GestionaService, private newAuthenticationService: AuthenticationService, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.getRestaurants();
      this.getUsers();
      this.userActiu = null;
      this.restaurantActiu = null;
      this.cline();
  }

  getRestaurants() {
      this.newRestaurantService.getRestaurantes().subscribe(
          (data) => this.restaurants = data,
          (error) => console.log(error),
          () => console.log()
      );
  }

  getUsers() {
      this.newUserService.getUsers().subscribe(
          (data) => this.usuaris = data,
          (error) => console.log(error),
          () => console.log()
      );
  }

  checkDisponible () {
      this.newUserService.getUser(this.usuario).subscribe(
          (data) => this.disponibilitatUser = data.length,
          (error) => console.log(error),
          () => console.log()
      );
  }

  cline() {
      this.usuario = '';
      this.pass1 = '';
      this.pass2 = '';
      this.nombre = '';
      this.dni = '';
      this.carec = null;
      this.disponibilitatUser = null;
  }

  getGestionats() {
      this.newGestionaService.getGestionatsByUser(((this.userActiu.url.split('/', 5))[4])).subscribe(
          (data) => this.getRestaurantsGestionats(data),
          (error) => console.log(error),
          () => console.log()
      );
  }

  getRestaurantsGestionats(gestionats) {
      this.gestionats = [];
      for (const gestio of gestionats){
          let index = 0;
          let trobat = false;
          while ((index < this.restaurants.length) || (!trobat)) {
              if (this.restaurants[index].url === gestio.idRestaurant) {
                  this.gestionats.push(this.restaurants[index]);
                  trobat = true;
              }
              index = index + 1;
          }
      }
      console.log(this.gestionats);
      console.log(this.restaurants);
      console.log(gestionats);
  }

  deleteGestionatResaturant(restaurantID: number) {
      this.newGestionaService.getGestionat(((this.userActiu.url.split('/', 5))[4]), restaurantID).subscribe(
          (data) => (
              this.newGestionaService.deleteGestiona(data[0].id).subscribe(
                  (datos) => this.getGestionats(),
                  (error) => this.errorText = (error),
                  () => () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                      this.succes = res;
                  })
              )
          ),
          (error) => this.errorText = (error),
          () => console.log()
      );
  }

  addNewGestionat() {
      if (this.restaurantActiu === null) {
          this.newTranslateService.get('no_selected_restaurant', {value: 'world'}).subscribe((res: string) => {
              this.errorText = res;
          });
      }else {
          const tempGestio = JSON.stringify({
              idUsuari: this.userActiu.url,
              idRestaurant: this.restaurantActiu.url
          });
          this.newGestionaService.postGestiona(tempGestio).subscribe(
              (data) => this.getGestionats(),
              (error) => this.errorText = (error),
              () => this.newTranslateService.get('succes_new_gestio', {value: 'world'}).subscribe((res: string) => {
                  this.succes = res;
              })
          );
      }
  }

    addTrabajador() {
      if ((this.usuario === '' || this.usuario === null) || (this.disponibilitatUser === null || this.disponibilitatUser > 0)) {
          this.newTranslateService.get('invalid_user', {value: 'world'}).subscribe((res: string) => {
              this.errorTextUser  = res;
          });
      } else if ((this.pass1 !== this.pass2) || (this.pass1 === '') || (this.pass1 === null) || (this.pass2 === '') || (this.pass2 === null) || (this.pass1.length < 8)) {
          this.newTranslateService.get('invalid_pass', {value: 'world'}).subscribe((res: string) => {
              this.errorTextUser  = res;
          });
      } else if (this.nombre === '') {
          this.newTranslateService.get('invalid_name', {value: 'world'}).subscribe((res: string) => {
              this.errorTextUser  = res;
          });
      } else if (this.dni === '')  {
          this.newTranslateService.get('invalid_dni', {value: 'world'}).subscribe((res: string) => {
              this.errorTextUser  = res;
          });
      } else if (this.carec === null) {
          this.newTranslateService.get('select_carec', {value: 'world'}).subscribe((res: string) => {
              this.errorTextUser  = res;
          });
      } else {
          this.errorTextUser = '';
          const tempUser = JSON.stringify({
              username: this.usuario,
              email: this.usuario + '@none.com',
              password1: this.pass1,
              password2: this.pass2
          });
          this.newAuthenticationService.registerUser(tempUser).subscribe(
              (data) => this.newUserService.getUser(this.usuario).subscribe(
                  (datos) => this.addDatosUser(datos[0]),
                  (error) => this.errorTextUser = (error)
              ),
              (error) => this.errorTextUser = (error),
              () => this.newTranslateService.get('succes_new_user', {value: 'world'}).subscribe((res: string) => {
                    this.succesUser  = res;
                })
          );
      }
    }

    addDatosUser(usuario) {
        const tempUserProfile = JSON.stringify({
            user: usuario.url,
            nom: this.nombre,
            DNI: this.dni,
            carrec: this.carec
        });
        this.newUserService.postUserprofile(tempUserProfile).subscribe(
            (data) => (
                this.cline(),
                    this.getUsers()
            ),
            (error) => this.errorTextUser = (error),
            () => this.newTranslateService.get('succes_new_user', {value: 'world'}).subscribe((res: string) => {
                this.succesUser  = res;
            })
        );
    }

}
