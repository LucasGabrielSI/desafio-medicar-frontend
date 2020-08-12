import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private BASE_URL = "https://medicar.herokuapp.com/";

  headers: any;
  headersToken: any;
  user: any;

  constructor(private httpClient: HttpClient) {
    this.user = {
      token: ""
    };

    var userTemp = JSON.parse(localStorage.getItem("user"));
    if (userTemp != null && userTemp != "") {
      this.user = userTemp;
      this.headersToken = new HttpHeaders().set(
        "Authorization",
        "token " + this.user.token
      );
    }

    this.headers = new HttpHeaders().set("Content-Type", "application/json");
  }

  actionToken() {
    var userTemp = JSON.parse(localStorage.getItem("user"));
    if (userTemp != null && userTemp != "") {
      this.user = userTemp;
      this.headersToken = new HttpHeaders().set(
        "Authorization",
        "token " + this.user.token
      );
    }
  }

  public sendLogarRequest(objJSON) {
    console.log(objJSON);
    return this.httpClient.post(
      this.BASE_URL + "usuarios/login/",
      objJSON,
      this.headers
    );
  }

  public sendRegisterRequest(objJSON): Observable<any> {
    console.log(objJSON);

    return this.httpClient.post(
      this.BASE_URL + "usuarios/cadastro/",
      objJSON,
      this.headers
    );
  }

  public getConsultas(): Observable<any> {
    this.actionToken();
    return this.httpClient.get(this.BASE_URL + "consultas/", {
      headers: this.headersToken
    });
  }

  public getAgendas(): Observable<any> {
    this.actionToken();
    return this.httpClient.get(this.BASE_URL + "agendas/", {
      headers: this.headersToken
    });
  }

  public getEspecialidades(): Observable<any> {
    this.actionToken();
    return this.httpClient.get(this.BASE_URL + "especialidades/", {
      headers: this.headersToken
    });
  }

  public getMedicos(): Observable<any> {
    this.actionToken();
    return this.httpClient.get(this.BASE_URL + "medicos/", {
      headers: this.headersToken
    });
  }

  public marcarConsulta(objJSON): Observable<any> {
    this.actionToken();
    return this.httpClient.post(this.BASE_URL + "consultas/", objJSON, {
      headers: this.headersToken
    });
  }

  public desmarcarConsulta(id): Observable<any> {
    this.actionToken();
    return this.httpClient.delete(this.BASE_URL + "consultas/" + id + "/", {
      headers: this.headersToken
    });
  }
}
