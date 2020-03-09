import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

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

  getDataFromDatabase(id, currentView) {
    console.log(environment.NODE_HOST)
    return this.http.post(environment.NODE_HOST + '/getData', { num: id, view:currentView }, this.httpOptions);
  }

  getUniqueDataFromDatabase(id, currentView) {
    console.log(currentView);
    return this.http.post(environment.NODE_HOST + '/getUniqueData', { id: id, view:currentView }, this.httpOptions);
  }

  deleteDataFromDatabase(id) {
    return this.http.post(environment.NODE_HOST + '/deleteData', { id: id }, this.httpOptions);
  }

  updateDataEntry(id, houseInfo, addressInfo) {
    const payload = JSON.stringify(houseInfo);
    return this.http.post(environment.NODE_HOST + '/updateDataEntry', { id: id, data: houseInfo, addressInfo: addressInfo }, this.httpOptions);
  }

  getCoordinates(address1, city, state, zipcode) {
    return this.http.post(environment.NODE_HOST + '/geocode', { address1: address1, city: city, state: state, zipcode: zipcode }, this.httpOptions);
  }

}
