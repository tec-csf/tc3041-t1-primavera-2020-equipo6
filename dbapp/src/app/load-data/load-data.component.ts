
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService }  from '../http.service';
import { HouseInfo } from '../models/house-info';
import { AddressInfo } from '../models/address-info';
import { ColegioInfo } from '../models/colegio-info';
import { FederalInfo } from '../models/federal-info';
import { MesaInfo } from '../models/mesa-info';
import { MunicipalInfo } from '../models/municipal-info';
import { PartidoInfo } from '../models/partido-info';
import { VotanteInfo } from '../models/votante-info';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css']
})
export class LoadDataComponent implements OnInit {

  colegioModel:ColegioInfo;
  federalModel:FederalInfo;
  mesaModel:MesaInfo;
  municipalModel:MunicipalInfo;
  partidoModel:PartidoInfo;
  votanteModel:VotanteInfo;

  errErrorMessage:boolean;
  errMessage:string;

  greenErrorMessage:boolean;
  greenMessage:string;

  validate_inputs:boolean;


  constructor(private _router:Router, private _httpService:HttpService) {

    this.colegioModel = new ColegioInfo('', '', '');
    this.federalModel = new FederalInfo('', '', '');
    this.mesaModel = new MesaInfo('', '', '');
    this.municipalModel = new MunicipalInfo('', '', '');
    this.partidoModel = new PartidoInfo('', '', '');
    this.votanteModel = new VotanteInfo('', '', '', '', '', '');
    

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
      case 4: return this.municipalModel;
      case 5: return this.federalModel;
      default: return null;
  }
  }

  submitData(table){
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
