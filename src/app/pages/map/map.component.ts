import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: []
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // 地图加载完成后
  mapLoadedEvent($event) {

  }

}
