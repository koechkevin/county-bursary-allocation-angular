import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WardComponent} from './components/ward/ward.component';
import {MainComponent} from './components/main/main.component';

const routes: Routes = [{ path: '', component: MainComponent}, {
  path: 'wards/:amount/:id', component: WardComponent
}, {path: '**', redirectTo: '/'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
