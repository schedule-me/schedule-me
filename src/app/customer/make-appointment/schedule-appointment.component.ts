import { Component, OnInit } from '@angular/core';

// import { EmployeeServiceService } from '../employee/employee-service.service'

@Component({
  selector: 'app-schedule-appointment',
  template: `
   <h1>Make Appointment</h1>
<form >
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="form-control" name="name" [(ngModel)]="person.contactName" placeholder="Name" >
    </div>
    <div class="form-group">
      <label>Number</label>
      <input type="text" class="form-control" name="number" [(ngModel)]="person.contactNumber" placeholder="Number">
    </div>
    <div class="form-group">
      <label>Employee</label>
    <select [(ngModel)]="person.employeeId" [ngModelOptions]="{standalone: true}">
      <option *ngFor="let employee of employees" [ngValue]="employee">
        {{employee.firstName}}
      </option>
    </select>
    <div class="ui-g-12 ui-md-4">
      <label>Date</label>
      <input type="date"  [(ngModel)]="start" [ngModelOptions]="{standalone: true}"/>
    </div>
    <div class="form-group">
      <label>Service</label>
      <select multiple name="service" class="form-control" [(ngModel)]="person.description" [ngModelOptions]="{standalone: true}">
        <option *ngFor="let service of services" [value]="service">{{service.service}}</option>
      </select>
    </div>
    <button (click)='getTime()' class="btn btn-default">check</button>
    <!--<div class="form-group">
      <label>Times</label>
      <select multiple name="hours" class="form-control" [(ngModel)]="times" [ngModelOptions]="{standalone: true}">
        <option *ngFor="let hour of hours" [value]="hour.value">{{hour.label}}</option>
      </select>
    </div>-->
    <div class="form-group">
      <label>Available</label>
      <select multiple name="available" class="form-control" [(ngModel)]="open" [ngModelOptions]="{standalone: true}">
        <option *ngFor="let hour of available" [value]="hour">{{hour.label}}</option>
      </select>
    </div>
    </div>

    <button (click)='makeAppointment()' class="btn btn-default">Submit</button>
  </form>
  `,
  styles: []
})
export class ScheduleAppointmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
