import { Component, Input } from '@angular/core';
import { TabComponent } from './tab.component'

@Component({
  selector: 'app-tabs',
  template: `
    <ul class="{{tabsStyle}}">
      <li class="{{tabTitleClass}}" *ngFor="let tab of tabs" (click)="onSelectTab(tab)" [class.active]="tab.active">
        <a>{{ tab.title }}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `,
  styles: []
})

export class TabsComponent {

  tabs: TabComponent[] = []
  @Input() tabsStyle: string
  @Input() tabTitleClass: string

  addTab(tab: TabComponent) {
    this.tabs.push(tab)

    if (this.tabs.length === 1) {
      this.onSelectTab(tab)
    }
  }

  onSelectTab(selectedTab: TabComponent) {
    this.tabs.forEach((tab) => {
      if (tab == selectedTab) {
        tab.active = true
      } else {
        tab.active = false
      }
    })
  }
}