import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-demo',
  templateUrl: './test-demo.component.html',
  styleUrls: ['./test-demo.component.less']
})
export class TestDemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // 地图加载完成后
  mapLoadedEvent($event) {
    console.log($event)
  }

}
