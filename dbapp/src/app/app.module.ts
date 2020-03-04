import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { ViewEntryComponent } from './view-entry/view-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadDataComponent,
    ViewDataComponent,
    EditDataComponent,
    ViewEntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
     FormsModule,
     FontAwesomeModule,
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAM0KXiz3xTv9KAvnOIdm5J0Agnwp3_lOI'
    })
  ],
   providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
