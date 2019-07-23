import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Locations, NewAllocation, ResponseAllocation, ResponseAllocations} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }
  createAllocation(data: NewAllocation): Observable<ResponseAllocation> {
    return this.http.post<any>('/api/allocations', data);
  }
  getAllocations(): Observable<ResponseAllocations> {
    return this.http.get<any>('/api/allocations');
  }
  getLocations(): Observable<Locations> {
    return this.http.get<any>('/api/list');
  }
  createSubCounty(data): Observable<any> {
   return this.http.post<any>('/api/sub-county', data);
  }
  createWard(data): Observable<any> {
    return this.http.post<any>('/api/wards', data);
  }
  createWardLocations(data): Observable<any> {
    return this.http.post<any>('/api/wards/location', data);
  }
  getWardLocations(): Observable<any> {
    return this.http.get<any>('/api/wards/location');
  }

  createSubLocation(data): Observable<any> {
    return this.http.post<any>('/api/wards/sub-location', data);
  }
  getSubLocations(): Observable<any> {
    return this.http.get<any>('/api/wards/sub-location');
  }

  createVillage(data): Observable<any> {
    return this.http.post<any>('/api/wards/villages', data);
  }
  getVillages(): Observable<any> {
    return this.http.get<any>('/api/wards/villages');
  }

  postApplication(data): Observable<any> {
    return this.http.post<any>('/api/apply', data);
  }
}
