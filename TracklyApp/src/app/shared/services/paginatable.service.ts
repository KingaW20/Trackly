import { Injectable } from '@angular/core';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class PaginatableService {
  
  public paginator : Paginator;

  constructor(pag?: Paginator) { 
    this.paginator = pag ?? new Paginator({});
  }

  changePage(newPage: number, listLength?: number) {
    this.paginator.currentPage = newPage
    this.paginator.updatePaginatorInfo(listLength!)
  }
}
