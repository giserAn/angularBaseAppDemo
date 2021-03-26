import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestDemoComponent } from './project/test-demo/test-demo.component';


const routes: Routes = [
    { path: 'test', component: TestDemoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainContentRoutingModule { }
