import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainContentRoutingModule } from './main-content-routing.module';
import { TestDemoComponent } from './project/test-demo/test-demo.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MainContentRoutingModule
    ],
    declarations: [TestDemoComponent]
})
export class MainContentModule { }
