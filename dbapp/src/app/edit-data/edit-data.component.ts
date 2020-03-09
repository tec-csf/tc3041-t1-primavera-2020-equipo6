
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from '../http.service';
import { ColegioInfo } from '../models/colegio-info';
import { FederalInfo } from '../models/federal-info';
import { MesaInfo } from '../models/mesa-info';
import { MunicipalInfo } from '../models/municipal-info';
import { PartidoInfo } from '../models/partido-info';
import { VotanteInfo } from '../models/votante-info';


@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.css']
})
export class EditDataComponent implements OnInit {

  rowID:string;
  data:any;
  view:number;

  showMessage:boolean;
  showData:boolean;

  errErrorMessage:boolean;
  errMessage:string;

  greenErrorMessage:boolean;
  greenMessage:string;

  editColegio:boolean;
  editMesa:boolean;
  editPartido:boolean;
  editVotante:boolean;
  editMunicipal:boolean;
  editFederal:boolean;

  colegioModel:ColegioInfo;
  federalModel:FederalInfo;
  mesaModel:MesaInfo;
  municipalModel:MunicipalInfo;
  partidoModel:PartidoInfo;
  votanteModel:VotanteInfo;

  validateInputs:boolean;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.rowID = '';
    this.data = [];
    this.view = 0;

    this.editColegio = false;
    this.editColegio = false;
    this.editMesa = false;
    this.editPartido = false;
    this.editVotante = false;
    this.editMunicipal = false;
    this.editFederal = false;

    this.validateInputs = true;

    this.colegioModel = new ColegioInfo('', '', '');
    this.federalModel = new FederalInfo('', '', '');
    this.mesaModel = new MesaInfo('', '', '');
    this.municipalModel = new MunicipalInfo('', '', '');
    this.partidoModel = new PartidoInfo('', '', '');
    this.votanteModel = new VotanteInfo('', '', '', '', '', '');

    this.showMessage = true;
    this.showData = false;

    this.errErrorMessage = false;
    this.errMessage = '';

    this.greenErrorMessage= false;
    this.greenMessage = '';
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.rowID = params['id'];
        console.log(params);
        this.setTypeBools(params['type']);
        console.log('rowID: ' + this.rowID);
      })
      this.getDataEntry();
  }

  setTypeBools(type) {
    switch(type) {
      case "colegio": {
        console.log("colegio");
        this.editColegio = true;
        this.view = 0;
        break;
      }
      case "mesa": {
        this.editMesa = true;
        this.view = 1;
        break;
      }
      case "partido": {
        this.editPartido = true;
        this.view = 2;
        break;
      }
      case "votante": {
        this.editVotante = true;
        this.view = 3;
        break;
      }
      case "municipal": {
        this.editMunicipal = true;
        this.view = 4;
        break;
      }
      case "federal": {
        this.editFederal = true;
        this.view = 5;
        break;
      }
    }
  }

  checkInputs(){
    return true;
  }

  submitData(){
    // var check = this.checkInputs();
    // console.log(check);
    // if (check == false){
    //   this.errMessage = 'Please enter the fields correctly!';
    //   this.errErrorMessage = true;
    //   window.scrollTo(0 , 0);
    // }
    // else{
    //   this.errErrorMessage = false;
    //   var dataObs = this._httpService.updateDataEntry(this.rowID,this.model, this.addressModel);
    //   dataObs.subscribe(data=>{
    //     if(data['success'] != 1){
    //       console.log(data['message']);
    //     }
    //     else{
    //       console.log(data['message']);
    //       localStorage.setItem("dataUpdated","true");
    //       this._router.navigate(['/viewData']);
    //     }
    //   })
    // }

  }

  getDataEntry(){
    var dataObs = this._httpService.getUniqueDataFromDatabase(this.rowID, this.view);
    dataObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log(data['message']);
      }
      else{
        this.data = data['data'][0];
        this.showMessage = false;
        this.showData = true;
        console.log(this.data);
      }
    })
  }

}
