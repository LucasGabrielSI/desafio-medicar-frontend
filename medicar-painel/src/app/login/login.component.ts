import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { UserService } from "../user.service";
import { RouterModule, Routes, Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  formCredentials: any;
  retorno: any;
  msgFormError: any;

  constructor(private userService: UserService, private router: Router) {
    this.formCredentials = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
    this.msgFormError = "";
  }

  logar() {
    this.msgFormError = "";
    console.log(this.formCredentials.value.email, "email");
    console.log(this.formCredentials.value.password, "password");

    const objJSON = {
      email: this.formCredentials.value.email,
      senha: this.formCredentials.value.password
    };

    this.userService.sendLogarRequest(objJSON).subscribe(data => {
      console.log(data);
      this.retorno = data;
      if (this.retorno.status == 200) {
        console.log("sucesso");
        var user = JSON.stringify({
          email: this.retorno.email,
          nome: this.retorno.nome,
          token: this.retorno.token
        });
        localStorage.setItem("user", user);
        this.router.navigate(["consultas"]);
      } else {
        this.msgFormError = this.retorno.msg;
        console.log("erro");
      }
    });
  }

  hide = true;

  ngOnInit(): void {}
}
