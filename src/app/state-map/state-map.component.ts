import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import { ActivatedRoute, Params } from '@angular/router';
import * as topojson from 'topojson';

declare var $: any;
@Component({
  selector: 'app-state-map',
  templateUrl: './state-map.component.html',
  styleUrls: ['./state-map.component.scss'],
})
export class StateMapComponent implements OnInit {
  public name: string = 'd3';
  @Input() districtCol: boolean;
  @Input('state') result: string = '';
  @Output() notifyParent = new EventEmitter<string>();
  @Output() districtHover = new EventEmitter<string>();
  @Output() mouseout = new EventEmitter<string>();
  @Output() districtColor = new EventEmitter<string>();
  loadingStateComponent: boolean = true;

  constructor(private route: ActivatedRoute) { }

  locations = [
    // "Mon",
    // 'Peren',
    // 'Kiphire',
    // 'Tuensang',
    // "Changlang",
    // "Chirang",
    "Morigaon",
    // "Kokrajhar",
    // "Kangra",
    // "Sukma",
    // "Kondagaon",
    "Raipur",
    // "Gumla",
    // "Kalahandi",
    // "Koraput",
    'Bhagalpur',
    // "Banka",
    // "Madhepura",
    'Gaya',
    'Muzaffarpur',
    // 'RaeBareli',
    'Sambhal',
    // "Bahraich",
    // "Jhajjar",
    // "Srinagar",
    // "Mysuru",
    'Kalaburagi',
    "Raichur",
    'Yadgir',
    // "Chamarajanagara",
    'Nagapattinam',
    'Bidar',

  ];

  INACTIVE_LOCATIONS_WITH_CLICK_ENABLED = [
    'Changlang',
    // 'Morigaon',
    'Kangra',
    'Sukma',
    // 'Raipur',
    'Sahibganj',
    'Lohardaga',
    'Kalahandi',
    'Banka',
    'Madhepura',
    'Jhajjar',
    'Mysuru',
    // 'Raichur',
    'Chamarajanagara',
    // 'Bidar',
    'Bengaluru Urban',
    'Srinagar',
  ];

  INACTIVE_LOCATIONS_WITH_CLICK_DISABLED = [
    'Chirang',
    'Kokrajhar',
    'Kondagaon',
    'Gumla',
    'Koraput',
    'Bahraich',
    'Mon',
    'Peren',
    'Kiphire',
    'Tuensang',
    'RaeBareli',
    'Bengaluru Rural',

  ];

  ngOnInit(): void {
    let width = 800;
    let height = 800;
    var svgContainer = $('#svg');
    // var width = svgContainer.width();
    // var aspect = width / height;
    var container = svgContainer.parent();
    // var targetWidth = container.width();
    let svg = d3.select('#svg');
    svg.attr('width', width);
    svg.attr('height', Math.round(height));
    let g = svg.append('g');
    var file = '../assets/states-map/' + this.result + '.json';
    var districtHover = this.districtHover;
    var colorOn = this.districtColor;
    var notify = this.notifyParent;
    var loc = this.locations;
    const INACTIVE_LOCATIONS_WITH_CLICK_ENABLED =
      this.INACTIVE_LOCATIONS_WITH_CLICK_ENABLED;
    const INACTIVE_LOCATIONS_WITH_CLICK_DISABLED =
      this.INACTIVE_LOCATIONS_WITH_CLICK_DISABLED;
    d3.json(file).then(function (topology: any) {
      // <---- Renamed it from data to topology
      var topology1 = topojson.feature(topology, topology.objects.districts);
      let projection = d3.geoMercator().fitSize([width, height], topology1);
      let path = d3.geoPath().projection(projection);
      g.selectAll('path')
        .data(topojson.feature(topology, topology.objects.districts).features)
        .join((enter): any => {
          var sel = enter
            .append('path')
            .attr('d', path)
            .attr('id', function (d: any, i): any {

              // var id = d.properties.district.split(' ').join('');
              var id = d.properties.district;
              colorOn.emit(id);

              return id;
            })
            .attr('stroke-width', 2)
            .attr('fill', function (d: any) {
              // var id = d.properties.district.split(' ').join('');
              var id = d.properties.district;
              if (INACTIVE_LOCATIONS_WITH_CLICK_DISABLED.includes(id)) {
                return '#f5f5f5';
              }
              else if (loc.includes(id)) {
                return '#278ea6';
              }
              else if (INACTIVE_LOCATIONS_WITH_CLICK_ENABLED.includes(id)) {
                return '#cdedfb';
              }
              else {
                return '#f5f5f5';
              }
              // return loc.includes(id) ? '#278ea6' : '#cdedfb';
            })
            .attr('stroke', '#ffff')
            .style('cursor', (d: any) => {
              // var id = d.properties.district.split(' ').join('');
              var id = d.properties.district;
              if (loc.includes(id) || INACTIVE_LOCATIONS_WITH_CLICK_ENABLED.includes(id)) {
                return 'pointer';
              }
              // return INACTIVE_LOCATIONS_WITH_CLICK_DISABLED.includes(id)
              //   ? 'not-allowed'
              //   : 'pointer';
              return 'default';
            })
            .on('mouseenter', (d) => {
              // var id = d.properties.district.split(" ").join("");
              var id = d.srcElement.id;
              setTimeout(() => {
                districtHover.emit(id);
              }, 10);
              // districtHover.emit(id); // change
              // d3.select();
              // d3.select('#' + id)
              //   .attr('stroke-width', function (d: any) {
              //     var id = d.properties.district.split(' ').join('');
              //     return loc.includes(id) ? 0 : 2;
              //   })
              //   .attr('stroke', '#ffff');
              // d3.select('#' + id).attr('fill', function (d: any) {
              //   var id = d.properties.district.split(' ').join('');
              //   return loc.includes(id) ? '#278ea6' : '#cdedfb';
              // });
            })
            .on('mouseleave', (d) => {
              setTimeout(() => {
                this.mouseout.emit();
              }, 10);
              // this.mouseout.emit()
              var id = d.srcElement.id;
              // d3.select('#' + id)
              //   .attr('fill', function (d: any) {
              //     var id = d.properties.district.split(' ').join('');
              //     return loc.includes(id) ? '#278ea6' : '#cdedfb';
              //   })
              //   .attr('stroke-width', 2)
              //   .attr('stroke', '#ffffff');
              // d3.select("#" + id).attr("fill", "#fff");
            })
            .on('touchstart', (d) => { })
            .on('click', (d, i) => {
              console.log(d);
              console.log(d.srcElement.id)
              // var id = d.srcElement.id.split(' ').join('');
              const id = d.srcElement.id
              if (
                loc.includes(id) ||
                INACTIVE_LOCATIONS_WITH_CLICK_ENABLED.includes(id)
              ) {
                notify.emit(d.srcElement.id);
              }
            });
          sel.append('title').text((d: any, i) => {
            return d.properties.district;
          });
        });
    });

    this.loadStateComponent();
  }

  loadStateComponent() {
    setTimeout(() => {
      this.loadingStateComponent = false;
    }, 500);
  }
}
