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
  wardAllocation = 0;
  subCountyName: string;
  newWard: string;
  selectedSubcounty: number;
  state = {
    activeSubcounty: 0
  };
  today: Date = new Date();
  limit = 10;
  isSubmitting: boolean;
  peopleWithDisabilityAllocation = 0;
  paginationData = {
    pageCount: 1, count: 1, currentPage: 1
  };
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
      this.state.activeSubcounty = this.subCounties.length && this.subCounties[0].id || 0;
      this.selectedSubcounty = this.state.activeSubcounty;
      const myWards = this.locations.wards.filter((each) => each.sub_county === this.state.activeSubcounty);
      this.wards = this.pagination(myWards, this.paginationData.currentPage - 1);
      this.selected = this.allocations[this.allocations.length - 1].amount;
      this.calculateAmount();
    });
  }

  pagination(wards: Ward[], page): Ward[] {
    const pageCount = Math.ceil(wards.length / this.limit);
    const count = wards.length;
    const validPage = page <= 0 ? 1 : Math.min(page, pageCount);
    const maximum = (validPage * this.limit) - 1;
    const minimum = (validPage - 1) * this.limit;
    const output = wards.filter((e, i) => i >= minimum && i <= maximum);
    this.paginationData = {
      pageCount, count, currentPage: validPage
    };
    return output;
  }

  calculateAmount(): void {
    this.wardAllocation = 0.9 * this.selected / this.locations.wards.length;
    this.peopleWithDisabilityAllocation = 0.1 * this.selected;
  }

  changeSelect(): void {
    this.calculateAmount();
  }

  filterWards(id: number): void {
    const myWards = this.locations.wards.filter((each) => each.sub_county === id);
    this.wards = this.pagination(myWards, this.paginationData.currentPage);
    this.state.activeSubcounty = id;
    this.selectedSubcounty = this.state.activeSubcounty;
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
    this.isSubmitting = true;
    const subscriber = {
      next: (response) => {
        this.subCounties.unshift(response.subCounty);
        document.getElementById('add').style.height = '0';
        document.getElementById('add').style.border = 'none';
        this.subCountyName = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.log(error);
        this.isSubmitting = true;
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
        if (this.selectedSubcounty.toString() === this.state.activeSubcounty.toString()) {
          this.wards = this.pagination([...this.wards, createdWard], this.paginationData.currentPage);
        }
      });
    }
  }
  submit(): void {
    if (this.amount > 10000) {
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

  changeLimit(): void {
    if (this.state.activeSubcounty) {
    this.filterWards(this.state.activeSubcounty);
    } else  {
      this.wards =  this.pagination(this.locations.wards, 1);
    }
  }

  next(): void {
    if (this.state.activeSubcounty) {
      const myWards = this.locations.wards.filter((each) => each.sub_county === this.state.activeSubcounty);
      this.wards = this.pagination(myWards, this.paginationData.currentPage + 1);
    } else {
      this.wards =  this.pagination(this.locations.wards, this.paginationData.currentPage + 1);
    }
  }

  previous(): void {
    if (this.state.activeSubcounty) {
      const myWards = this.locations.wards.filter((each) => each.sub_county === this.state.activeSubcounty);
      this.wards = this.pagination(myWards, this.paginationData.currentPage - 1);
    } else {
      this.wards =  this.pagination(this.locations.wards, this.paginationData.currentPage - 1);
    }
  }

  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
