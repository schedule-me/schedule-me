import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx'
import { BehaviorSubject } from 'rxjs/Rx'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router'

@Injectable()
export class AuthService {

  isUserLoggedIn: boolean = localStorage.getItem('jwt-token') !== null
  userAssociations: any = this.extractUserAssociations()
  loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isUserLoggedIn)
  userAssociationsSubject: BehaviorSubject<any> = new BehaviorSubject<boolean>(this.userAssociations)
  constructor(private http: Http, private router: Router) { }
  
  submitUserData(user) {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')
      let options = new RequestOptions({ headers: headers })

      return this.http.post('/api/users/signup', JSON.stringify({ user: user }), options)
        .map((response: Response) => {
            let parsed = response.json()
            if (parsed.response.success) {
              localStorage.setItem('userId', parsed.response.userId)
              localStorage.setItem('jwt-token', parsed.token)
              this.setUserLoggedIn(true)
            }
            return parsed
        })
        .catch(this.handleError)
  }

  signin(user) {
    let headers = new Headers()
    let encodedCredentials = btoa(`${user.email}:${user.password}`)
    headers.append('authorization', encodedCredentials)
    let options = new RequestOptions({ headers: headers })

    return this.http.get('api/users/signin', options)
      .map((response: Response) => {
        let parsed = response.json()
        if (parsed.response.success) {
          localStorage.setItem('userId', parsed.response.userId)
          localStorage.setItem('jwt-token', parsed.token)
          localStorage.setItem('userAssociations', JSON.stringify(parsed.response.associations))
          this.setUserAssociations()
          this.setUserLoggedIn(true)
        }
        return parsed
      })
  }

  signout() {
    localStorage.removeItem('jwt-token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userAssociations')
    localStorage.removeItem('localCompanyId')
    this.setUserLoggedIn(false)
    this.router.navigate([''])
  }

  setUserLoggedIn(loggedIn: boolean): void {
    this.isUserLoggedIn = loggedIn
    this.loggedInSubject.next(loggedIn)
  }
  
  getIsUserLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable()
  }

  extractUserAssociations() {
    // return object of form { <UserCompanyId>: [<companyId>, <isAdmin>,], ...}
    let associations = JSON.parse(localStorage.getItem('userAssociations'))
    if (associations === null) {
      return null
    }
    return associations.reduce((mapping, association) => {
      mapping[association.id] = [association.companyId, association.admin]
      return mapping
    }, {})
  }

  getUserAssociations() {
    return this.userAssociationsSubject.asObservable()
  }

  setUserAssociations() {
    this.userAssociations = this.extractUserAssociations()
    this.userAssociationsSubject.next(this.userAssociations)
  }

  handleError(err: Response) {
    return Observable.throw(err.json() || 'Server error')
  }
  
}
