import { Component, OnInit } from '@angular/core';

import { EmployeeServiceService } from '../employee-service.service'

@Component({
  selector: 'app-employee-appointments',
  templateUrl: './employee-appointments.component.html',
  styleUrls: ['./employee-appointments.component.css']
})
export class EmployeeAppointmentsComponent {

  constructor(employeeServiceService:EmployeeServiceService) { 
    employeeServiceService.getAppointment()
    .subscribe(
      appointments => this.appointments = appointments.json()
    )
  }

  appointments;
}