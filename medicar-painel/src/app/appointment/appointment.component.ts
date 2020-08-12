import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"]
})
export class AppointmentComponent implements OnInit {
  userName: any;
  formAgendar: any;

  retorno: any;

  agenda: any[];
  consultas: any[];
  especialidades: any[];
  medicos: any[];
  medicosSelecionados: any[];
  diasLivres: any[];
  horarios: any[];
  horariosLivres: any[];
  agenda_horarios: any[];
  horarioSelecionado: any;
  msgFormError: any;
  msgFormSuccess: any;
  msgFormDeleteSuccess: any;
  constructor(private router: Router, private userService: UserService) {
    this.formAgendar = new FormGroup({
      especialidade: new FormControl(""),
      medico: new FormControl(""),
      dia: new FormControl(""),
      hora: new FormControl("")
    });
    this.agenda_horarios = [];
    this.consultas = [];
    this.medicosSelecionados = [];
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    if (user == null) {
      this.router.navigate(["login"]);
    } else {
      if (user.token == "" || user.token == null) {
        this.router.navigate(["login"]);
      } else {
        this.userName = user.nome;
      }
    }
  }

  getConsultas() {
    this.userService.getConsultas().subscribe(data => {
      this.consultas = data;
      console.log(this.consultas);
    });
  }

  getEspecialidades() {
    this.userService.getEspecialidades().subscribe(data => {
      this.especialidades = data;
    });
  }

  getMedicos() {
    this.userService.getMedicos().subscribe(data => {
      this.medicos = data;
      this.medicosSelecionados = [];
      for (var i = 0; i < this.medicos.length; i++) {
        if (
          this.medicos[i].especialidade.id ==
          this.formAgendar.value.especialidade
        ) {
          this.medicosSelecionados.push(this.medicos[i]);
        }
      }
    });
  }

  getData() {
    this.userService.getAgendas().subscribe(data => {
      this.agenda = data;
      this.diasLivres = [];
      this.horariosLivres = [];
      for (var i = 0; i < this.agenda.length; i++) {
        if (this.agenda[i].medico.id == this.formAgendar.value.medico) {
          this.diasLivres.push(this.agenda[i].dia);
        }
      }
      this.diasLivres = this.diasLivres.reverse();
    });
  }

  getHorarios() {
    this.userService.getAgendas().subscribe(data => {
      this.agenda = data;
      this.horariosLivres = [];
      for (var i = 0; i < this.agenda.length; i++) {
        console.log(this.agenda[i].dia);
        if (
          this.agenda[i].dia == this.formAgendar.value.dia &&
          this.agenda[i].medico.id == this.formAgendar.value.medico
        ) {
          console.log("aqui");
          for (var j = 0; j < this.agenda[i].horarios.length; j++) {
            this.horariosLivres.push(this.agenda[i].horarios[j]);
          }
        }
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  ngOnInit(): void {
    this.getConsultas();
    this.getEspecialidades();
  }
  preMarcarConsulta() {
    this.horarioSelecionado = this.formAgendar.value.hora;
    console.log(this.horarioSelecionado.substring(0, 5));
    this.horarioSelecionado = this.horarioSelecionado.substring(0, 5);

    this.userService.getAgendas().subscribe(data => {
      this.agenda = data;
      for (var i = 0; i < this.agenda.length; i++) {
        for (var j = 0; j < this.agenda[i].horarios.length; i++) {
          if (
            this.agenda[i].horarios[j] == this.formAgendar.value.hora &&
            this.agenda[i].medico.id == this.formAgendar.value.medico
          ) {
            this.marcarConsulta(this.agenda[i].id, this.horarioSelecionado);
          }
        }
      }
    });
  }
  marcarConsulta(agendaId, horarioSelecionado) {
    const objJSON = {
      agenda_id: agendaId,
      horario: horarioSelecionado
    };

    this.userService.marcarConsulta(objJSON).subscribe(data => {
      console.log(data);
      this.retorno = data;
      try {
        console.log("sucesso");
        this.getConsultas();
        this.msgFormSuccess = true;
        this.formAgendar = new FormGroup({
          especialidade: new FormControl(""),
          medico: new FormControl(""),
          dia: new FormControl(""),
          hora: new FormControl("")
        });
      } catch (err) {
        this.msgFormError = true;
      }
    });
  }
  desmarcarConsulta(idConsulta) {
    this.userService.desmarcarConsulta(idConsulta).subscribe(data => {
      try {
        console.log("sucesso");
        this.getConsultas();
        this.msgFormDeleteSuccess = true;
      } catch (err) {
        console.log("erro");
      }
    });
  }
}
