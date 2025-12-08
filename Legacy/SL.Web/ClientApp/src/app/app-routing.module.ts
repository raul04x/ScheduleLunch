import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LunchComponent } from './views/lunch/lunch.component';

const routes: Routes = [
  { path: '', component: LunchComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
