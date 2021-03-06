import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapRoutingModule,
  ],
  declarations: [MapComponent]
})
export class MapModule { }
