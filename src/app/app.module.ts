import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppHttpInterceptor } from './app-http.interceptor';
import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

import { NZ_I18N, zh_CN, NZ_CONFIG } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

// 应用初始化
export function appInitFactory(appInitService: AppInitService) {
  return () => appInitService.init();
}

// Angular 模块（面向整个应用的）
const angular_modules = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule
]

// 自定义的 Angular 特性模块
const custom_modules = [
  AppRoutingModule,
  SharedModule,
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    ...angular_modules,
    ...custom_modules
  ],
  providers: [
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_CONFIG, useValue: { message: { nzTop: 100 } } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
