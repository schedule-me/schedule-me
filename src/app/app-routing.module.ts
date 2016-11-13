import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomerComponent } from './customer/customer.component'
import { EmployeeComponent } from './employee/employee.component'
import { CompanyComponent } from './company/company.component'
import { HomeComponent } from './home.component'
import { SignupComponent } from './auth/signup.component'
import { SigninComponent } from './auth/signin.component'

const routes: Routes = [
    { path: '', component: HomeComponent, children: [
        { path: '', redirectTo: 'signup', pathMatch: 'full' },
        { path: 'signup', component: SignupComponent },
        { path: 'signin', component: SigninComponent }
    ] },
    { path: 'users', component: CustomerComponent },
    { path: 'work', component: EmployeeComponent },
    { path: 'company', component: CompanyComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    // providers: [guardService],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }

