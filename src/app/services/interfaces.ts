export interface SubCounty {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface Ward {
  id: number;
  name: string;
  sub_county: number;
  parent: SubCounty;
  createdAt: string;
  updatedAt: string;
}
export interface Allocation {
  id: number;
  createdAt: string;
  updatedAt: string;
  amount: number;
}
export interface Locations {
  wards: Ward[];
  subCounties: SubCounty[];
}
export interface NewAllocation {
  amount: number;
}
export interface ResponseAllocation {
  allocation: Allocation;
}
export interface ResponseAllocations {
  allocations: Allocation[];
}
