import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { HouseInfo } from './models/house-info';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private http: HttpClient) {

  }



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json',
    })
  };

  createNewDataEntry(info, currentView) {
    const payload = JSON.stringify(info);
    return this.http.post(environment.NODE_HOST + '/newDataEntry', { content: payload, view:currentView }, this.httpOptions);
  }

  getDataFromDatabase(id, currentView, histData) {
    console.log(environment.NODE_HOST)
    const payload = JSON.stringify(histData);
    return this.http.post(environment.NODE_HOST + '/getData', { num: id, view:currentView, histData:payload }, this.httpOptions);
  }

  getUniqueDataFromDatabase(id, currentView) {
    return this.http.post(environment.NODE_HOST + '/getUniqueData', { id: id, view:currentView }, this.httpOptions);
  }

  deleteDataFromDatabase(id, currentView) {
    return this.http.post(environment.NODE_HOST + '/deleteData', { id: id, view:currentView }, this.httpOptions);
  }

  updateDataEntry(id, model, currentView) {
    const payload = JSON.stringify(model);
    return this.http.post(environment.NODE_HOST + '/updateDataEntry', { id: id, content: payload, view:currentView }, this.httpOptions);
  }

}
