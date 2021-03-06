import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';


@Component({
  selector: 'app-make-appointment',
  templateUrl: './make-appointment.component.html',
  styles: [
    `
      .panel-heading {
        background-color: #008ea8;
        color: white;
        text-align: center;
      }
    `
  ]
})
export class MakeAppointmentComponent implements OnInit, OnDestroy {
  public company: any
  public companySchedules: any
  public calendarConfig: any
  public calendarHeaders: any
  public employeeSchedules: any
  public employeeAppointments: any
  public employees: any = []
  public companyAppointments: any
  public checkedEmployees: any = {} // keep track of selected employees for calendar
  public eventSources: Array<any> = []

  private mapUserCompanyIdToUser: any = {}
  private companyIdSubscription: Subscription
  private calendarSubscription: Subscription
  private companyId: any
  private employeeSubscription: Subscription

  
  constructor(private route: ActivatedRoute, private customerService: CustomerService) {
    this.calendarHeaders = {
      left: 'prev, next, today',
      center: 'title',
      right: 'month, agendaWeek, agendaDay'
    }
    this.calendarConfig = {
      header: this.calendarHeaders,
      defaultView: 'agendaWeek',
      eventSources: [],
      editable: false
    }
  }

  ngOnInit() {
    this.employeeSubscription = this.customerService.getEmployees()
      .subscribe(
        (employees) => { 
          this.employees = employees 
          this.employees.forEach((employee) => {
            this.mapUserCompanyIdToUser[employee.UserCompany.id] = {
              employeeId: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName
            }
            this.checkedEmployees[employee.id] = true
          })
        }
      )

    this.companyIdSubscription = this.route.params
      .subscribe(
        (params: any) => {
          this.companyId = params['companyId']
          localStorage.setItem('localCompanyId', this.companyId)
          this.customerService.getCompanyById(this.companyId)
            .subscribe(
              (company) => { 
                this.company = company 
              },
              (err) => { console.log(err) }
            )
        }
      )

    this.calendarSubscription = this.customerService.getCompanySchedulesAndAppointments(this.companyId)
      .subscribe(
        (data) => {
          this.companyAppointments = data[0].map((appointment) => {
            return {
              employeeId: appointment.employeeId,
              employeeFirstName: appointment.employee.firstName,
              employeeLastName: appointment.employee.lastName,
              startTime: appointment.startTime,
              endTime: appointment.endTime
            }
          })
          this.companySchedules = data[1].map((schedule) => {
            return {
              employeeId: this.mapUserCompanyIdToUser[schedule.UserCompanyId].employeeId,
              employeeFirstName: this.mapUserCompanyIdToUser[schedule.UserCompanyId].firstName,
              employeeLastName: this.mapUserCompanyIdToUser[schedule.UserCompanyId].lastName,
              startTime: schedule.startTime,
              endTime: schedule.endTime
            }
          })
          this.employeeAppointments = this.categorizeByEmployeeId(this.companyAppointments, 'appointment')
          this.employeeSchedules = this.categorizeByEmployeeId(this.companySchedules, 'schedule')   
          this.updateEventSources(this.employees)
        }
      )
  }

  onCheckedEmployeeChange(checkedEmployees) {
    let updatedEmployees = []
    for(var employee in checkedEmployees) {
      if (checkedEmployees[employee]) {
        let found = this.employees.find((emp) => { 
          return emp.id === Number(employee)
        })
        found !== -1 && updatedEmployees.push(found)
      }
    }
    this.updateEventSources(updatedEmployees)
  }

  ngOnDestroy() {
    this.companyIdSubscription && this.companyIdSubscription.unsubscribe()
    this.calendarSubscription && this.calendarSubscription.unsubscribe()
    this.employeeSubscription && this.employeeSubscription.unsubscribe()
  }

  onNewAppointment($event) {
    let employeeName = ''
    for(let key in this.employees) {
      if (this.employees[key].id === $event.employeeId) {
        employeeName = this.employees[key].firstName + ' ' + this.employees[key].lastName
      }
    }
    this.employeeAppointments[$event.employeeId].push({
      title: `Apppointment for ${$event.contactName}`,
      start: $event.startTime,
      end: $event.endTime
    })
    this.updateEventSources(this.employees)
  }

  categorizeByEmployeeId(schedules, type) {
    let append = ''
    if (type === 'schedule') {
      append = 'working'
    } else if (type === 'appointment') {
      append = 'appointment'
    }
    // filters schedules by employeeId, { <employeeId>: <[schedules]>}
    return schedules.reduce((filtered, schedule) => {
      if (filtered[schedule.employeeId]) {
        filtered[schedule.employeeId].push({
          title: `${schedule.employeeFirstName} ${schedule.employeeLastName} ${append}`,
          start: schedule.startTime,
          end: schedule.endTime
        })
        return filtered
      }
      filtered[schedule.employeeId] = [{
          title: `${schedule.employeeFirstName} ${schedule.employeeLastName} ${append}`,
          start: schedule.startTime,
          end: schedule.endTime
      }]
      return filtered
    }, {})
  }

  updateEventSources(employees) {
    this.eventSources = []
    employees.forEach((employee) => {
      if(this.employeeSchedules[employee.id]) {
        this.eventSources.push({
          events: this.employeeSchedules[employee.id],
          color: 'light blue'
        })
        this.eventSources.push({
          events: this.employeeAppointments[employee.id],
          color: 'gray'
        })
      }
    })
  }
}
