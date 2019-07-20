import { Component, OnInit } from '@angular/core';
import {ApiServiceService} from '../../services/api-service.service';
import {Allocation, Locations, SubCounty, Ward} from '../../services/interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  amount: number;
  moment: any;
  allocations: Allocation[];
  subCounties: SubCounty[];
  wards: Ward[];
  locations: Locations;
  selected: number;
  wardAllocation: number;
  subCountyName: string;
  newWard: string;
  selectedSubcounty: number;
  state = {
    activeSubcounty: 0
  };
  today: Date = new Date();
  constructor(private apiService: ApiServiceService) {
    this.moment = moment;
  }

  ngOnInit() {
    this.apiService.getAllocations().subscribe((result) => {
      const defaultAllocation = [{
        id: 0,
        createdAt: '2019-07-20T06:43:44.230Z',
        updatedAt: '2019-07-20T06:43:44.230Z',
        amount: 45
      }];
      this.allocations = result.allocations.length ? result.allocations.reverse() : defaultAllocation;
    });
    this.apiService.getLocations().subscribe((response) => {
      this.locations = response;
      this.subCounties = response.subCounties.reverse();
      this.wards =  response.wards;
      this.selected = this.allocations[this.allocations.length - 1].amount;
      this.calculateAmount();
    });
  }

  calculateAmount(): void {
    this.wardAllocation = this.selected / this.locations.wards.length;
  }

  changeSelect(): void {
    this.calculateAmount();
  }

  filterWards(id: number): void {
    this.wards = this.locations.wards.filter((each) => each.sub_county === id);
    this.state.activeSubcounty = id;
  }

  calculateSubCountyAmount(id: number): string {
    const myWards = this.locations.wards.filter((each) => each.sub_county === id);
    return (this.wardAllocation * myWards.length).toFixed(2);
  }
  addSubcounty(): void {
    if (document.getElementById('add').style.height === '50px') {
      document.getElementById('add').style.height = '0';
    } else {
    document.getElementById('add').style.height = '50px';
    }
  }
  saveSubcounty(): void {
    const subscriber = {
      next: (response) => {
        this.subCounties.unshift(response.subCounty);
        document.getElementById('add').style.height = '0';
        document.getElementById('add').style.border = 'none';
        this.subCountyName = '';
      },
      error: (error) => {
        console.log(error);
      }
    };
    if (this.subCountyName) {
      this.apiService.createSubCounty({ subCounty: this.subCountyName })
        .subscribe(subscriber);
    }
  }
  cancel(): void {
    document.getElementById('add').style.height = '0';
    document.getElementById('add').style.border = 'none';
  }

  createWard(): void {
    if (this.newWard && this.selectedSubcounty) {
    const data = {
      name: this.newWard,
      subCounty: this.selectedSubcounty
    };
    this.apiService.createWard(data)
      .subscribe((response) => {
        const createdWard = response.ward;
        const parentArray = this.subCounties.filter((each) => each.id === createdWard.sub_county);
        createdWard.parent = parentArray[0];
        this.locations.wards.push(createdWard);
        this.calculateAmount();
        this.newWard = '';
      });
    }
  }
  submit(): void {
    if (this.amount) {
      this.apiService.createAllocation({amount: this.amount})
        .subscribe((result) => {
          this.allocations.shift();
          this.allocations.push(result.allocation);
          this.selected = result.allocation.amount;
          this.calculateAmount();
          this.amount = null;
        });
    }
  }

}
