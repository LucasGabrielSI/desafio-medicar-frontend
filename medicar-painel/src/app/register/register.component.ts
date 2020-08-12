import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  hide = true;
  hideConfirm = true;

  formCredentials: any;
  msgFormSuccess: any;
  msgFormErro: any;
  formValid: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.formValid = true;
    this.formCredentials = new FormGroup({
      username: new FormControl(),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
      ]),
      password: new FormControl(),
      confirm_password: new FormControl()
    });
  }

  ngOnInit(): void {}

  register() {
    console.log(this.formCredentials.value.password);
    console.log(this.formCredentials.value.confirm_password);
    if (
      this.formCredentials.value.password !=
      this.formCredentials.value.confirm_password
    ) {
      this.formValid = false;
    }
    if (this.formValid == true) {
      const objJSON = {
        nome: this.formCredentials.value.username,
        email: this.formCredentials.value.email,
        senha: this.formCredentials.value.password
      };

      this.userService.sendRegisterRequest(objJSON).subscribe(data => {
        console.log(data);
        if (data.status == 200 || data.status == 201) {
          this.msgFormSuccess = true;
          this.router.navigate(["login"]);
        } else {
          this.msgFormErro = true;
        }
      });
    }
  }
}
