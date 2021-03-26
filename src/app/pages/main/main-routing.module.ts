import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { MenuListComponent } from './main-content/menu-list/menu-list.component';


const routes: Routes = [{
    path: '', component: MainComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: MenuListComponent },
        {
            path: 'project',
            loadChildren: () => import('src/app/pages/main/main-content/mian-content.module')
                .then(m => m.MainContentModule), data: {}, canLoad: []
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
