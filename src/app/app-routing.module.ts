import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndiaMapComponent } from './india-map/india-map.component';
import { StateMapComponent } from './state-map/state-map.component';

const routes: Routes = [{ path: "", component: HomeComponent }, { path: "state/:id", component: StateMapComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
