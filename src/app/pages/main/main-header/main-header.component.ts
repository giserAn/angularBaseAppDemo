import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'main-header-component',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less']
})
export class MainHeaderComponent implements OnInit {

  isCollapsed = false;

  @Output() foldEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  foldClick() {
    this.isCollapsed = !this.isCollapsed
    this.foldEvent.emit(this.isCollapsed)
  }

}
