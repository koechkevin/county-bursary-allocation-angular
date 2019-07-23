import { Component, OnInit } from '@angular/core';
import {ApiServiceService} from '../../services/api-service.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  subCounties = [];
  wards = [];
  locations = [];
  subLocations = [];
  villages = [];
  options = {
    wards: [], locations: [], subLocations: [], villages: []
  };
  defaultData = {
    name: '',
    guardian: '',
    institution: '',
    disability: null,
    subCounty: 0,
    isDisabled: 'false',
    ward: 0,
    location: 0,
    subLocation: 0,
    village: 0,
    contact: 0,
    feeBalance: 0,
    requestedAmount: 0
  };
  application = {...this.defaultData};
  constructor(private apiService: ApiServiceService) {
    this.apiService.getLocations().subscribe((response) => {
      this.subCounties = response.subCounties;
      this.wards = response.wards;
    });
    this.apiService.getWardLocations().subscribe((response) => {
      this.locations = response.wardLocations;
    });
    this.apiService.getSubLocations().subscribe((r) => {
      this.subLocations = r.subLocations;
    });
    this.apiService.getVillages().subscribe((response) => {
      this.villages = response.villages;
    });
  }

  ngOnInit() {
  }

  change(field) {
    switch (field) {
      case 'subCounty':
        this.options.wards = this.wards.filter(each => each.sub_county.toString() === this.application.subCounty);
        this.application = {
          ...this.application,
          ward: 0,
          location: 0,
          subLocation: 0,
          village: 0,
        };
        break;
      case 'ward':
        this.options.locations = this.locations.filter(each => each.ward.toString() === this.application.ward);
        this.application = {
          ...this.application,
          location: 0,
          subLocation: 0,
          village: 0,
        };
        break;
      case 'location':
        this.options.subLocations = this.subLocations.filter(each => each.location.toString() === this.application.location);
        this.application = {
          ...this.application,
          subLocation: 0,
          village: 0,
        };
        break;
      case 'sub-location':
        this.options.villages = this.villages.filter(each => each.sub_location.toString() === this.application.subLocation);
        this.application = {
          ...this.application,
          village: 0,
        };
        break;
      default: break;
    }
  }

  submit() {
    console.log(this.application);
    this.apiService.postApplication(this.application)
      .subscribe((response) => {
        this.application = this.defaultData;
      });
  }

}
