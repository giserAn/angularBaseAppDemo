import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EsriMapService {

  constructor() { }

  // (1)基本数据
  private map: any;
  private view: any;

  /**(2)设置地图实例 */
  setMap(map) {
    this.map = map;
  }

  /**(3)获取地图实例 */
  getMap(): Promise<any> {
    return new Promise((resolve) => {
      if (this.map) {
        resolve(this.map);
      } else {
        const interval = setInterval(() => {
          if (this.map) {
            clearInterval(interval);
            resolve(this.map);
          }
        }, 100);
      }
    });
  }

  /**(4)设置视图实例 */
  setView(view) {
    this.view = view;
  }

  /**(5)获取视图实例 */
  getView(): Promise<any> {
    return new Promise((resolve) => {
      if (this.view) {
        resolve(this.view);
      } else {
        const interval = setInterval(() => {
          if (this.view) {
            clearInterval(interval);
            resolve(this.view);
          }
        }, 100);
      }
    });
  }

}
