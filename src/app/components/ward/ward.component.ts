import { Component, OnInit } from '@angular/core';
import {ApiServiceService} from '../../services/api-service.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ward',
  templateUrl: './ward.component.html',
  styleUrls: ['./ward.component.scss']
})
export class WardComponent implements OnInit {

  locations = [];
  filteredLocations: any[];
  filteredSubLocations: any[];
  locationAmount: number;
  subLocations: any[] = [];
  subLocationAmount: number;
  villages: any[];
  filteredVillages: any[];
  villageAmount: number;
  newSubLocation = {
    name: '', location: 0
  };
  newLocation = {name: '', ward: 0};
  newVillage = {
    name: '',
    subLocation: 0
  };
  state = {
    activeLocation: 0, activeSubLocation: 0
  };
  constructor(
    private apiService: ApiServiceService,
    private route: ActivatedRoute
  ) {
    this.newLocation = {...this.newLocation, ward: parseInt(this.route.snapshot.params.id, 10)};
  }

  ngOnInit() {
    this.apiService.getWardLocations().subscribe((res) => {
      this.locations = res.wardLocations;
      this.filteredLocations = this.locations.filter((e) => e.ward.toString() === this.route.snapshot.params.id);
      this.locationAmount = parseFloat(this.route.snapshot.params.amount) / this.filteredLocations.length || 1;
      this.state.activeLocation = this.filteredLocations.length && this.filteredLocations[0].id || 0;
      this.apiService.getSubLocations().subscribe((r) => {
        this.subLocations = r.subLocations;
        this.filteredSubLocations = this.subLocations.filter(e => e.location === this.state.activeLocation);
        this.subLocationAmount = this.locationAmount / this.filteredSubLocations.length || 1;
        this.state.activeSubLocation = this.filteredSubLocations.length && this.filteredSubLocations[0].id || 0;
        this.apiService.getVillages().subscribe((response) => {
          this.villages = response.villages;
          this.filteredVillages = this.villages.filter((each) => each.sub_location === this.state.activeSubLocation);
          this.villageAmount = this.subLocationAmount / this.filteredVillages.length || 1;
        });
      });
    });
  }

  createSubLocation() {
    if (this.newSubLocation.name && this.newSubLocation.location) {
      this.apiService.createSubLocation(this.newSubLocation)
        .subscribe((response) => {
          this.apiService.getWardLocations().subscribe((res) => {
            this.locations = res.wardLocations;
            let subLocation = response.subLocation;
            subLocation = {...subLocation, location_data: this.locations.filter((e) => e.id === subLocation.location)[0]};
            this.subLocations.push(subLocation);
            this.filteredLocations = this.locations.filter((e) => e.ward.toString() === this.route.snapshot.params.id);
            this.filteredSubLocations = this.subLocations.filter(e => e.location === this.state.activeLocation);
            this.subLocationAmount = this.locationAmount / this.filteredSubLocations.length || 1;
            this.newSubLocation = {...this.newSubLocation, name: ''};
          });
        });
    }
  }

  setActive(id: number) {
    this.state.activeLocation = id;
    this.filteredSubLocations = this.subLocations.filter(e => e.location === this.state.activeLocation);
    this.subLocationAmount = this.locationAmount / this.filteredSubLocations.length || 1;
  }

  setActiveSubLocation(id: number) {
    this.state.activeSubLocation = id;
    this.filteredVillages = this.villages.filter(each => each.sub_location === this.state.activeSubLocation);
    this.villageAmount = this.subLocationAmount / this.filteredVillages.length || 1;
  }

  submit() {
    if (this.newLocation.name && this.newLocation.ward) {
      this.apiService.createWardLocations(this.newLocation)
        .subscribe(() => {
          this.apiService.getWardLocations().subscribe((res) => {
            this.locations = res.wardLocations;
            this.newLocation = {name: '', ward: 0};
          });
        });
    }
  }

  cancel() {
    this.newVillage = { ...this.newVillage, name: ''};
    this.newSubLocation = { ...this.newSubLocation, name: ''};
    this.newLocation = {...this.newLocation, name: ''};
  }

  createNewVillage() {
    console.log(this.newVillage);
    if (this.newVillage.name && this.newVillage.subLocation) {
      this.apiService.createVillage(this.newVillage)
        .subscribe((res) => {
          let village = res.village;
          village = { ...village, sub_location_data: this.subLocations.filter((sub) => sub.id === village.sub_location)[0]};
          this.villages.push(village);
          this.filteredVillages = this.villages.filter((each) => each.sub_location === this.state.activeSubLocation);
          this.villageAmount = this.subLocationAmount / this.filteredVillages.length || 1;
          this.newVillage = { ...this.newVillage, name: ''};
        });
    }
  }

  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}
