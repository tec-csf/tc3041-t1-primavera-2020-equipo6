
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService }  from '../http.service';
import { ColegioInfo } from '../models/colegio-info';
import { MesaInfo } from '../models/mesa-info';
import { PartidoInfo } from '../models/partido-info';
import { VotanteInfo } from '../models/votante-info';
import { MiembroInfo } from '../models/miembro-info';
import { SuplenteInfo } from '../models/suplente-info';
import { ListaInfo } from '../models/lista-info';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css']
})
export class LoadDataComponent implements OnInit {

  colegioModel:ColegioInfo;
  mesaModel:MesaInfo;
  partidoModel:PartidoInfo;
  votanteModel:VotanteInfo;
  miembroModel:MiembroInfo;
  suplenteModel:SuplenteInfo;
  listaModel:ListaInfo;

  errErrorMessage:boolean;
  errMessage:string;

  greenErrorMessage:boolean;
  greenMessage:string;

  validate_inputs:boolean;


  constructor(private _router:Router, private _httpService:HttpService) {

    this.colegioModel = new ColegioInfo('', '', '');
    this.miembroModel = new MiembroInfo('', '', '', '0', '', '', '');
    this.mesaModel = new MesaInfo('', '', '', '', '');
    this.suplenteModel = new SuplenteInfo('', '', '', '', '');
    this.partidoModel = new PartidoInfo('', '', '');
    this.listaModel = new ListaInfo('', '', '', '', '', '');
    this.votanteModel = new VotanteInfo('', '', '', '', '', '', '0', '0', '0');
    

    this.greenErrorMessage= false;
    this.greenMessage = '';

  }

  ngOnInit() {
    if (localStorage.getItem("dataEntered") == "true"){
      this.greenErrorMessage= true;
      this.greenMessage = 'Data Successfully Entered!';
    }
    localStorage.setItem("dataEntered","false");

  }

  getModel(table) {
    switch(table){
      case 0: return this.colegioModel;
      case 1: return this.mesaModel;
      case 2: return this.partidoModel;
      case 3: return this.votanteModel;
      case 4: return this.suplenteModel;
      case 5: return this.miembroModel;
      case 6: return this.listaModel;
      default: return null;
  }
  }

  submitData(table){
    if (this.votanteModel.apoderado = 'true') {this.votanteModel.apoderado = '1'}
    if (this.votanteModel.mexicano = 'true') {this.votanteModel.mexicano = '1'}
    if (this.votanteModel.municipalFederal = 'true') {this.votanteModel.municipalFederal = '1'}
    if (this.miembroModel.presidenteVocal = 'true') {this.miembroModel.presidenteVocal = '1'}
    console.log(this.colegioModel);
    var err=this._httpService.createNewDataEntry(this.getModel(table), table);
      err.subscribe(data=>{
        console.log("response:", data);
        if (data['success'] == -1 ){
          this.errMessage = 'Error sending data to server. Please try again.';
          localStorage.setItem("dataEntered","false");
          this.errErrorMessage = true;
        }
        else if (data['success'] == 1 ){
          console.log('WOHO');
          localStorage.setItem("dataEntered","true");
          window.location.reload();
          window.scrollTo(0 , 0);
        }
      })
  }
}
