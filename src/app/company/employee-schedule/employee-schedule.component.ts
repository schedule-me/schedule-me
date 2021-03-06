import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Response } from "@angular/http";
import * as moment from 'moment';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.css']
})
export class EmployeeScheduleComponent {
  companyId = localStorage.getItem('localCompanyId')
  newSchedule
  private employees
  private start
  private startTimes
  private endTimes
  private date
  days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
  step1GotDay = false
  step2GotEmployee = false
  startTime
  endTime
  description
  selectedEmployeeId: {
      id: '',
      userCompanyId: '',
      nameFirst: '',
      nameLast: '',
      admin: ''
  }
  selectedDay
  employeeScheduleForm : FormGroup

  blockConst(start, end) {
    let cur
    let block = []
    let startTime = start.split(':')
    let label;
    let hour = startTime[0]
    let minutes = startTime[1]
    let minInc = ['00','15','30','45']
    let count = minInc.indexOf(minutes)
    let check = false;
    

    while(!check){
      if(count>3){
        hour++
        count = 0
      }
      let time= `${hour}:${minInc[count]}`
      if(hour>11){
        if(hour>12){
          if(hour>21){
            label = hour-12
          }else{
            label= `0${hour-12}`
          }
        }else{
          label = hour
        }
        block.push({label: `${label}:${minInc[count]} PM` , value:time})
        if(moment(time,'h:mma').isSame(moment(end,'h:mma'))){
          check = true
        }
      }else{
        label = hour
        block.push({label: `${label}:${minInc[count]} AM` , value:time})
        if(moment(time,'h:mma').isSame(moment(end,'h:mma'))){
          check = true
        }
      }
      count++
    }
    return block
  }

  setDay(index) {
    this.step1GotDay = true
    this.selectedDay = index
  }

  setEmployee(id, userCompanyId, nameFirst, nameLast, admin) {
    this.step2GotEmployee = true
    this.selectedEmployeeId = {
      id: id,
      userCompanyId: userCompanyId,
      nameFirst: nameFirst,
      nameLast: nameLast,
      admin: admin
    }
  }
  // UserCompanyId = 1
  postOneSched() {
    let blockCreated = this.blockConst(this.employeeScheduleForm.value.startTime, this.employeeScheduleForm.value.endTime)
    let blockStrinified = JSON.stringify(blockCreated)

    let start = moment(this.employeeScheduleForm.value.date + ' ' +  this.employeeScheduleForm.value.startTime +' '+'+0000')
    let end = moment(this.employeeScheduleForm.value.date + ' ' + this.employeeScheduleForm.value.endTime+' '+'+0000')

    this.companyService.postOneEmployeeSched({
      startTime : start,
      endTime : end,
      description : this.employeeScheduleForm.value.description,
      UserCompanyId : this.selectedEmpUserCompanyId,
      block: blockStrinified
    })
    .subscribe( 
      (result) => {
        this.newSchedule = result
        if (result.UserCompanyId === this.selectedEmpUserCompanyId) {
          this.step2()
        }
      }
    )
  }

  constructor(private companyService: CompanyService, private formBuilder: FormBuilder) {
    this.companyService.navigateProfilePageOnRefresh()
    this.companyService.adminCheck()
    this.companyService.getEmployees(this.companyId)
    .subscribe(data => {

      this.employees = data.map(item=> {
        return {
          id: item.id,
          name: item.firstName + item.lastName,
          email: item.email,
          admin: item.UserCompany.admin,
          phoneNumber: item.phoneNumber,
          image: item.image,
          userCompanyId: item.UserCompany.id
        }
      })
    })

    this.employeeScheduleForm = formBuilder.group({
      'date' : [this.date, Validators.required],
      'startTime' : [this.startTime, Validators.required],
      'endTime' : [this.endTime, Validators.required],
      'description' : [this.description],
      'employeeId' : [this.selectedEmployeeId],
      'selectedDay' : [this.selectedDay]
    })
  }

  // MAIN SCHEDULE MODULE
  sched0 = true
  sched1 = false
  sched2 = false
  selectedEmpId
  selectedEmpName
  selectedEmpEmail
  selectedEmpAdmin
  selectedEmpPhoneNumber
  selectedEmpImage
  selectedEmpUserCompanyId

  step0() {
    this.sched1 = true
  }

  step1(id, name, email, admin, phone, image, userCompanyId) {
    console.log(id, 'should be an id')
    this.selectedEmpId = id
    this.selectedEmpName = name
    this.selectedEmpEmail = email
    this.selectedEmpAdmin = admin
    this.selectedEmpPhoneNumber = phone
    this.selectedEmpImage = image
    this.selectedEmpUserCompanyId = userCompanyId
    this.sched1 = false
    this.sched2 = true
}
  step2() {
    this.sched2 = false
    this.selectedEmpId = ''
    this.selectedEmpName = ''
    this.selectedEmpEmail = ''
    this.selectedEmpAdmin = ''
    this.selectedEmpPhoneNumber = ''
    this.selectedEmpImage = ''
    this.selectedEmpUserCompanyId = ''
  }
}