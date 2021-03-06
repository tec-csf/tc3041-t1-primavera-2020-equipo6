
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService }  from '../http.service';
import { HistData } from '../models/hist-data';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {

  data:any;

  showData:boolean;

  histData:HistData;

  showUpdateDataMessage:boolean;

  showMessage:boolean;

  showDataDeletedMessage:boolean;

  numOfData:string;

  currentView:number;

  constructor(private _httpService:HttpService, private _router: Router) {
    this.data = [];
    this.showMessage  = true;
    this.showData = false;
    this.showUpdateDataMessage = false;
    this.numOfData = '10';
    this.showDataDeletedMessage = false;
    this.currentView = 0;
    this.histData = new HistData(false, '', '');
  }

  ngOnInit() {
    this.aquireData();

    if (localStorage.getItem("dataDeleted") == "true"){
      this.showDataDeletedMessage = true;
      console.log(this.showDataDeletedMessage);
    }
    localStorage.setItem("dataDeleted","false");
  }

  aquireData(){
    console.log(this.currentView);
    //this.showData = false;
    //this.showMessage  = true;
    var dataObs = this._httpService.getDataFromDatabase(this.numOfData, this.currentView, this.histData);
    dataObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log(data['message']);
      }
      else{
        this.data = data['data'];
        console.log(this.data);

        if (localStorage.getItem("dataUpdated") == "true"){
          //this.showUpdateDataMessage = true;
          localStorage.setItem("dataUpdated","false");
        }

        this.showData = true;
        this.showMessage  = false;
      }
    })
  }

  deleteData(row:any){
    console.log('Deleting Data...');
    var dataObs = this._httpService.deleteDataFromDatabase(row, this.currentView);
    dataObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log(data['message']);
      }
      else{
        localStorage.setItem("dataDeleted","true");
        window.location.reload();
        window.scrollTo(0 , 0);
      }
    })
  }

}
