import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainSiderComponent } from './main-sider/main-sider.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MenuListComponent } from './main-content/menu-list/menu-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule
  ],
  declarations: [MainComponent, MainSiderComponent, MainHeaderComponent, MenuListComponent]
})
export class MainModule { }
