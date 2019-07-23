import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WardComponent} from './components/ward/ward.component';
import {MainComponent} from './components/main/main.component';
import {ApplicationComponent} from './components/application/application.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  {path: 'wards/:amount/:id', component: WardComponent},
  {path: 'apply', component: ApplicationComponent},
  {path: '**', redirectTo: '/'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
