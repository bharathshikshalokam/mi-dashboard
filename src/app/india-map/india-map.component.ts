import { Component, OnInit, Output, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { trigger, state, style, animate, transition } from '@angular/animations';

const style1 = style({
  opacity: 1,
  transform: "translateX(0)"
})

const style2 = style({
  opacity: 0,
  transform: "translateX(-100%)"
})

@Component({
  selector: 'app-india-map',
  templateUrl: './india-map.component.html',
  styleUrls: ['./india-map.component.scss'],
  animations: [
    trigger('foobar', [
      state('show', style1),
      state('hide', style2),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class IndiaMapComponent implements OnInit {
  @Output() stateHover = new EventEmitter<string>();
  state = 'hide'
  title = "map1";
  tooltip: string;
  jsonData: any;
  InitialEducationalParameters: any;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter<any>();

  @Output() mouseIn: EventEmitter<string> = new EventEmitter<string>();

  @Output() mouseOut: EventEmitter<string> = new EventEmitter<string>();

  stateColor: boolean = false;

  constructor(public el: ElementRef, private http: HttpClient, private router: Router,) { }
  ngOnInit(): void {
    this.http.get<any>('assets/map/Map.json').subscribe(data => {
      this.jsonData = data;
      this.InitialEducationalParameters = this.jsonData.India.EducationalParameters;
      console.log('jsonData:', this.jsonData);
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop
    const scrollPosition = window.pageYOffset
    if (scrollPosition >= componentPosition - 250) {
      this.state = 'show'
    } else {
      this.state = 'hide'
    }

  }

  onClick(value: any) {
    // if (value === 'Nagaland') {
    //   return;
    // }
    console.log(value, 'anu');
    var state = value.split(" ").join("");
    // this.router.navigate(["state", state]);
    this.notifyParent.emit({ state, value })
  }

  over_state(value: any) {
    this.mouseIn.emit(value)
    this.stateHover.emit(value);
    this.tooltip = value;
    console.log(value, 'state:console');
  }

  out_state(value: any) {
    console.log('mouseout')
    this.mouseOut.emit()
    this.tooltip = "";
    console.log(value);
  }

}
