import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Response } from "@angular/http";
import { CompanyService } from './company.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-company-landing',
  template: `
    <ul>
      <li *ngFor="let compies of this.companyService.companiesLanding" (click)="navigateToCompany(compies.id)">
      {{compies.name}}
      {{compies.address}}
      </li>
    </ul>
  `,
  styles: []
})
export class CompanyLandingComponent implements OnInit {

  navigateToCompany(companyId) {
  this.router.navigate(['/admin/company', companyId])
  }

  constructor(private companyService: CompanyService, private router: Router) {
    this.companyService.getAllCompaniesByUserId(localStorage.getItem('userId'))
      .subscribe(data => console.log(data, 'logging the data in constructure company service'))
   }   

  ngOnInit() {
  }

}