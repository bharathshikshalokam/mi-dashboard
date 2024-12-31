import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import '../../assets/map/Map.json';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  jsonData: any;
  InitialEducationalParameters: any;
  InitialProgramParameters: any;
  states: any;
  noData: boolean = false;
  districtReached: boolean = false;
  stateReached: boolean = false;
  stateName: string;
  districtName: string;
  selectState: string;
  selectDistrict: string;
  breadcrumbs: string[] = [''];
  districtData: any;
  state: string;
  district: string;
  districtColor: boolean;
  logo: string;
  url: any = 'https://shikshgraha.s3.ap-south-1.amazonaws.com/'
  breadCrumb: any
  public selectedState = ""
  public selectedDistrict = ""
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private location: Location) { }

  currentCardIndex = 0;
  totalCards: number;
  cards: NodeListOf<Element>;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const key = params['key'];

      if (!key) {
        this.selectedState = ""
        this.selectedDistrict = ""
        this.selectDistrict = ""
        this.state = ''
      }
      this.breadcrumbs.push('India');

    });

    this.http.get('../../assets/map/Map.json').subscribe(data => {
      this.jsonData = data;
      this.InitialEducationalParameters = this.jsonData.India.EducationalParameters;
      this.InitialProgramParameters = this.jsonData.India.ProgramParameters;
      this.states = this.jsonData.India.States;
      this.logo = this.jsonData.India.logo;
      console.log(this.states, 'dataIndia');
    });

    this.cards = document.querySelectorAll('.card');
    this.totalCards = this.cards.length;

  }

  scrollCards(direction: number) {
    this.currentCardIndex += direction;
    if (this.currentCardIndex < 0) {
      this.currentCardIndex = this.totalCards - 1;
    } else if (this.currentCardIndex >= this.totalCards) {
      this.currentCardIndex = 0;
    }
    const newPosition = this.currentCardIndex * -100;
    const cardContainer = document.querySelector('.card-container') as HTMLElement;
    cardContainer.style.transform = `translateX(${newPosition}%)`;
  }

  convertToIndianNumberingSystem(number: any) {
    const lakh = 100000;
    const crore = 10000000;

    console.log('number', number)
    if (number < lakh) {
      return number.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    } else if (number < crore) {
      const lakhPart = (number / lakh).toFixed(2);
      return lakhPart.toLocaleString() + ' Lakh';
    } else {
      const crorePart = (number / crore).toFixed(2);
      return crorePart.toLocaleString() + ' Crore';
    }
  }


  setQueryParams(state: string) {
    // debugger
    const currentParams = { ...this.route.snapshot.queryParams };

    currentParams['key'] = state;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'merge',
    });
  }

  backToCountryHandler(BreadcrumbState: any) {
    if (BreadcrumbState == 'State') {
      this.selectDistrict = ""
      this.selectedDistrict = ''
      this.districtReached = false
    } else {
      this.selectDistrict = ""
      this.state = ''
      this.districtReached = false
      this.router.navigate([], {
        queryParams: {
          'key': null,
        },
        queryParamsHandling: 'merge'
      })
      window.location.reload();
    }
    // this.location.back()
  }

  // state

  onStateClickHandler(state: any) {
    this.selectedState = ""
    console.log('Data received from child:', state);
    setTimeout(() => {
      this.selectedState = state.state
      this.stateReached = true
      this.router.navigate(['/states', state.state]);
    }, 1);
    this.breadCrumb = state.value
    this.breadcrumbs = ['India', state];
    this.setQueryParams(state.state)
  }

  onStateHover(state: string) {
    this.updateEducationalAndProgramParams(state);
    this.state = state;
    console.log('statewhich', state)
  }

  updateEducationalAndProgramParams(state: string) {
    const stateData = this.states.find((stateSelected: any) => stateSelected.StateName === state);
    console.log('stateData', stateData)
    if (stateData) {
      this.InitialEducationalParameters = stateData?.EducationalParameters;
      this.InitialProgramParameters = stateData?.ProgramParameters;
      this.stateName = stateData?.StateName;
      this.noData = false;
      this.selectState = state
    } else {
      this.InitialEducationalParameters = '';
      this.InitialProgramParameters = '';
      this.noData = true;
    }

    console.log('stateData', stateData);
  }

  onStateMouseOutHandler(event: any) {
    // debugger
    this.InitialEducationalParameters = this.jsonData.India.EducationalParameters;
    this.InitialProgramParameters = this.jsonData.India.ProgramParameters;
    this.noData = false;
    this.stateName = '';
    this.selectState = ''
    this.state = '';

    console.log("onMouseOutHandler")
  }


  // district
  onDistrictClickHandler(district: string) {
    this.selectedDistrict = ""
    this.districtReached = true;

    console.log('ddd', district);
    setTimeout(() => {
      this.selectedDistrict = district;
      this.districtName = district;
      this.districtName = '';
      this.breadcrumbs = ['India', this.selectedState, district];
      this.updateEducationalAndProgramParamsCity(district)
    }, 1);

    const selectedStateData = this.states.find((stateSelected: any) => stateSelected.StateName === this.selectState);
    const districtData = selectedStateData.Districts.find((districtSelected: any) => districtSelected.DistrictName === district)

    if (districtData) {
      this.districtData = districtData
      console.log('districtData', this.districtData)
    }


    this.setQueryParams(district)
  }

  onDistrictHover(district: string) {
    this.districtReached = true;
    setTimeout(() => {
      this.updateEducationalAndProgramParamsCity(district)
    }, 1)

    console.log('zyx', district)
  }

  updateEducationalAndProgramParamsCity(district: string) {
    const selectedStateData = this.states.find((stateSelected: any) => stateSelected.StateName === this.selectState);
    const districtData = selectedStateData.Districts.find((districtSelected: any) => districtSelected.DistrictName === district)
    this.selectDistrict = district;

    console.log('selectedStateData', districtData)
    if (districtData) {
      this.InitialEducationalParameters = districtData?.EducationalParameters;
      this.InitialProgramParameters = districtData?.ProgramParameters;
      this.noData = false;
      this.selectDistrict = district;
    } else {
      this.InitialEducationalParameters = '';
      this.InitialProgramParameters = '';
      this.noData = true;
    }

    console.log('InitialEducationalParameters', this.InitialEducationalParameters);
    console.log('InitialProgramParameters', this.InitialProgramParameters)
    console.log('districtdata', district);
  }

  onDistrictMouseOutHandler(event: any) {
    const selectedStateData = this.states.find((stateSelected: any) => stateSelected.StateName === this.selectState);
    if (selectedStateData) {
      // setTimeout(() => {
      this.InitialEducationalParameters = selectedStateData?.EducationalParameters;
      this.InitialProgramParameters = selectedStateData?.ProgramParameters;
      this.noData = false;
      this.stateName = '';
    }
    this.districtReached = false;

    console.log("onMouseOutHandler")
  }

  getColorBasedOnDistricts(districtName: string): string {
    console.log('districtName', districtName)
    const selectedStateData = this.states.find((stateSelected: any) => stateSelected.StateName === this.selectState);
    if (selectedStateData) {
      const districtExists = selectedStateData.Districts.find((districtSelected: any) => districtSelected.DistrictName === districtName);
      if (districtExists) {
        this.districtColor = true;
      } else {
        this.districtColor = false;
      }
    }
    return '';
  }


}
