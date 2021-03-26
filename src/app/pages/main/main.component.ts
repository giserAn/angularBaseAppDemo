import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  isCollapsed = false;
  marginLeftWidth = '200px';

  ngOnInit() {

  }

  foldEventBack(value) {
    this.isCollapsed = value;
    this.marginLeftWidth = !this.isCollapsed ? '200px' : '80px'
  }


}
