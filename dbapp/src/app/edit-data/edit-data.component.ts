
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { ColegioInfo } from '../models/colegio-info';
import { MesaInfo } from '../models/mesa-info';
import { PartidoInfo } from '../models/partido-info';
import { VotanteInfo } from '../models/votante-info';
import { SuplenteInfo } from '../models/suplente-info';
import { MiembroInfo } from '../models/miembro-info';
import { ListaInfo } from '../models/lista-info';


@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.css']
})
export class EditDataComponent implements OnInit {

  rowID: string;
  data: any;
  view: number;

  showMessage: boolean;
  showData: boolean;

  errErrorMessage: boolean;
  errMessage: string;

  greenErrorMessage: boolean;
  greenMessage: string;

  editColegio: boolean;
  editMesa: boolean;
  editPartido: boolean;
  editVotante: boolean;
  editSuplente: boolean;
  editMiembro: boolean;
  editLista: boolean;

  colegioModel: ColegioInfo;
  mesaModel: MesaInfo;
  partidoModel: PartidoInfo;
  votanteModel: VotanteInfo;
  suplenteModel: SuplenteInfo;
  miembroModel: MiembroInfo
  listaModel: ListaInfo;

  validateInputs: boolean;

  constructor(private _activaterouter: ActivatedRoute, private _httpService: HttpService, private _router: Router) {
    this.rowID = '';
    this.data = [];
    this.view = 0;

    this.editColegio = false;
    this.editColegio = false;
    this.editMesa = false;
    this.editPartido = false;
    this.editVotante = false;
    this.editSuplente = false;
    this.editMiembro = false;
    this.editLista = false;

    this.validateInputs = true;

    this.colegioModel = new ColegioInfo('', '', '');
    this.mesaModel = new MesaInfo('', '', '', '', '');
    this.partidoModel = new PartidoInfo('', '', '');
    this.votanteModel = new VotanteInfo('', '', '', '', '', '', '', '', '');
    this.suplenteModel = new SuplenteInfo('', '', '', '', '');
    this.miembroModel = new MiembroInfo('', '', '', '', '', '', '');
    this.listaModel = new ListaInfo('', '', '', '', '', '');

    this.showMessage = true;
    this.showData = false;

    this.errErrorMessage = false;
    this.errMessage = '';

    this.greenErrorMessage = false;
    this.greenMessage = '';
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params => {
        this.rowID = params['id'];
        this.setTypeBools(params['type']);
      })
    this.getDataEntry();
  }

  setTypeBools(type) {
    switch (type) {
      case "colegio": {
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
      case "suplente": {
        this.editSuplente = true;
        this.view = 4;
        break;
      }
      case "miembro": {
        this.editMiembro = true;
        this.view = 5;
        break;
      }
      case "lista": {
        this.editLista = true;
        this.view = 5;
        break;
      }
    }
  }

  checkInputs() {
    return true;
  }

  getCurrentModel() {
    switch (this.view) {
      case 0: return this.colegioModel;
      case 1: return this.mesaModel;
      case 2: return this.partidoModel;
      case 3: return this.votanteModel;
      case 4: return this.suplenteModel;
      case 5: return this.mesaModel;
      case 6: return this.listaModel;
    }
  }

  submitData() {
    this.errErrorMessage = false;
    var dataObs = this._httpService.updateDataEntry(this.rowID, this.getCurrentModel(), this.view);
    dataObs.subscribe(data => {
      if (data['success'] != 1) {
        console.log(data['message']);
      }
      else {
        console.log(data['message']);
        localStorage.setItem("dataUpdated", "true");
        this._router.navigate(['/viewData']);
      }
    })
  }

  getDataEntry() {
    var dataObs = this._httpService.getUniqueDataFromDatabase(this.rowID, this.view);
    dataObs.subscribe(data => {
      if (data['success'] != 1) {
        console.log(data['message']);
      }
      else {
        this.data = data['data'][0];
        this.showMessage = false;
        this.showData = true;
        console.log(this.data);
      }
    })
  }

}
