import { Component } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Response } from "@angular/http";

import { CompanyService } from '../company.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})

export class AddEmployeeComponent {
 /* USER SEARCH */
  userNotFound = false
  userShow = false
  admin = ['true', 'false']
  userId
  companyId
  addEmployeeAdmin
  userSearch
  showAdminControl = false;
  companyIds = localStorage.getItem('companyId') || 1
  addEmployeeForm : FormGroup
  deleteEmployeeForm : FormGroup

  userFetched = {
    id: '',
    email: 'JohnSmith@schedule-me.com',
    name: 'John Smith',
    image: 'http://www.clker.com/cliparts/B/R/Y/m/P/e/blank-profile-md.png',
    phoneNumber: '818-111-1111'
  }

  searchUser(name) {
    this.companyService.getUsers(name)
      .subscribe(data => {
        if (!data.response.success) {
          this.userNotFound = true
          this.userShow = false
        } else if (data.response.success) {
          this.userNotFound = false
          this.userShow = true
        }
        this.userFetched.id = data.response.user.id
        this.userFetched.email = data.response.user.email
        this.userFetched.name = data.response.user.firstName + data.response.user.lastName
        this.userFetched.image = data.response.user.image || "http://www.clker.com/cliparts/B/R/Y/m/P/e/blank-profile-md.png",
        this.userFetched.phoneNumber = data.response.user.phoneNumber
      })
  }
  /* USER SEARCH END */
  onSubmit() {
    this.companyService.addEmployee({
      userId : this.userFetched.id,
      companyId : localStorage.getItem('localCompanyId'),
      isAdmin : this.addEmployeeAdmin
    })
    .subscribe(data => {
      if (data.status === 200) {
      this.companyService.getEmployees(localStorage.getItem('localCompanyId'))
      .subscribe(data => {})
      //this.asyncString = this.companyService.getUsersFromCompany(1)
      this.userFetched = {
        id: '',
        email: 'JohnSmith@schedule-me.com',
        name: 'John Smith',
        image: 'http://www.clker.com/cliparts/B/R/Y/m/P/e/blank-profile-md.png',
        phoneNumber: '818-111-1111'
      }
      this.userSearch = ''
      this.userShow = false
      } else {
        alert("please make sure all forms are filled")
      }
    })
  }
  // SELECT AND DELETE AN EMPLOYEE
  consolelog(ds) {
    console.log(ds)
  }

  deleteEmployeeSubmit(id, name) {
    let confDelete =  confirm(`Are you sure you would like to delete ${name}`)
    if (confDelete === false) {
      return
    } else {
    this.companyService.deleteEmployee({
      userId: id, 
      companyId: localStorage.getItem('localCompanyId')
    })
    .subscribe(data => {
      this.companyService.getEmployees(localStorage.getItem('localCompanyId'))
      .subscribe(data => {})
      // this.asyncString = this.companyService.getUsersFromCompany(1)
    })
    }
  }
  
  updateAdminSubmit(add) {
    if (this.showAdminControl === true) {
      if (add) {
      }
    }
    this.showAdminControl === false ? this.showAdminControl = true : this.showAdminControl = false;
  }
  
  constructor(private companyService: CompanyService, private formBuilder: FormBuilder) {
    /* DO NOT TOUCH, AUTH AND REDIRECT */
    this.companyService.navigateProfilePageOnRefresh()
    this.companyService.adminCheck()
    /* DO NOT TOUCH, AUTH AND REDIRECT END */
    /* CONTROLLER get employees */
    this.companyService.getEmployees(localStorage.getItem('localCompanyId')).subscribe()
    /* CONTROLLER get employees END */

    this.deleteEmployeeForm = formBuilder.group({
      'userId' : [this.userId, Validators.required],
      'companyId' : [this.companyId, Validators.required]
    })
  }

}

