import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-district-page',
  templateUrl: './district-page.component.html',
  styleUrls: ['./district-page.component.scss']
})
export class DistrictPageComponent implements OnInit {
  @Input() district: any; 
  @Input() selectedState: any;
  @Input() breadCrumb: any
  @Input() selectedDistrict: any;
  @Output() back = new EventEmitter<string>();
  url: any =  'https://shikshgraha.s3.ap-south-1.amazonaws.com/'

  constructor() { }

  ngOnInit(): void {
    console.log('districtd', this.district)
  }

   onClick(value: any) {
      this.back.emit(value)
  }

}
