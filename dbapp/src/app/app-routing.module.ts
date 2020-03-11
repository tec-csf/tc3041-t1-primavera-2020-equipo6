import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';

const routes: Routes = [
  {path: 'header', component: HeaderComponent},
  {path: '', component: LoadDataComponent},
  {path: 'viewData', component: ViewDataComponent},
  {path: 'editData/:type/:id', component: EditDataComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
