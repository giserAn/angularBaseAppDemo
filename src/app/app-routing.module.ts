import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'main', loadChildren: () => import('src/app/pages/main/main.module').then(m => m.MainModule), data: {}, canLoad: [] },
  { path: 'map', loadChildren: () => import('src/app/pages/map/map.module').then(m => m.MapModule), data: {}, canLoad: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
