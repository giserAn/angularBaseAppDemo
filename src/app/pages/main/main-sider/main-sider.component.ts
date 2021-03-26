import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'main-sider-component',
  templateUrl: './main-sider.component.html',
  styleUrls: ['./main-sider.component.less']
})
export class MainSiderComponent implements OnInit {

  @Input() isCollapsed: boolean = true;

  constructor() { }

  ngOnInit() {
  }


}
