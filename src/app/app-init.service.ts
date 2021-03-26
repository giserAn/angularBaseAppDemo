import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppInitService {

    constructor(private http: HttpClient) { }

    /**(1)是否登录 */
    private isLogin() {
        return true;
    }

    /**(2)登录前 */
    private beforeLogin() {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    /**(3)登录后 */
    private afterLogin() {
        return new Promise(resolve => {
            resolve(null);
            // const time = new Date().getTime();
            // this.http.get(`assets/json/environment.json?time=${time}`).subscribe((res: any) => {
            //     const environmentData = res;
            //     for (let key in environmentData) {
            //         environment[key] = environmentData[key];
            //     }
            // }, () => { }, () => { resolve(null); });
        });
    }

    /**(4)初始化应用 */
    init(): Promise<any> {
        return this.isLogin() ? this.afterLogin() : this.beforeLogin();
    }

}
