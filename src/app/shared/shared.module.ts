import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EsriMapComponent } from './components/esri-map/esri-map.component';
import { DrawToolComponent } from './components/esri-map/draw-tool/draw-tool.component';
import { SketchViewModelToolComponent } from './components/esri-map/sketchViewModel-tool/sketchViewModel-tool.component';
import { OrginToolComponent } from './components/esri-map/orgin-tool/orgin-tool.component';

// Angular 模块
const angular_modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];

// 其他第三方的插件模块
const third_modules = [
  NgZorroAntdModule,
];

// 共享的组件
const shared_components = [
  EsriMapComponent,
  DrawToolComponent,
  SketchViewModelToolComponent,
  OrginToolComponent
];

@NgModule({
  imports: [
    ...angular_modules,
    ...third_modules
  ],
  declarations: [
    ...shared_components
  ],
  exports: [
    ...angular_modules,
    ...third_modules,
    ...shared_components
  ]
})
export class SharedModule { }
