import { Component, OnInit } from '@angular/core';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { SchedulerFile } from 'src/app/entities/scheduler-file';
import { ConfigurationFile } from 'src/app/entities/configuration-file';
import { Hours } from 'src/app/entities/hours';
import { Eater } from 'src/app/entities/eater';

@Component({
  selector: 'app-lunch',
  templateUrl: './lunch.component.html',
  styleUrls: ['./lunch.component.css']
})
export class LunchComponent implements OnInit {

  configuration: ConfigurationFile;
  scheduler: SchedulerFile;
  today = new Date();
  myEaterName = '';
  currentEaterName = '';
  isEaterAdded = false;

  constructor(private schedulerSvc: SchedulerService) { }

  ngOnInit() {
    this.schedulerSvc.getConfigFile().subscribe(c => this.configuration = c);
    this.schedulerSvc.getSchedule().subscribe(s => this.setScheduler(s));
    this.myEaterName = localStorage.getItem('currentEaterName');

    if (this.myEaterName) {
      this.currentEaterName = String(this.myEaterName);
    }
    else {
      this.myEaterName = '';
    }
  }

  setScheduler(scheduler: SchedulerFile) {
    this.schedulerSvc.setSchedule(scheduler).subscribe(s => this.scheduler = s);
  }

  addEater(group: Hours) {
    if (this.myEaterName && group.eaters.length < this.configuration.capacity) {
      if (this.isEaterNameRepeted(this.myEaterName)) {
        alert(`Dear ${this.myEaterName}, you have already schedule your hour for lunch!!!`);
      }
      else {
        const objEater = new Hours();
        objEater.id = group.id;
        objEater.eaters = [];
        objEater.eaters.push(this.myEaterName);
        this.schedulerSvc.addEather(objEater).subscribe(s => this.scheduler = s);
      }
    }
    else {
      alert('Eater name is required!!!');
    }
  }

  setMyEaterName() {
    if (this.isEaterNameRepeted(this.myEaterName)) {
      alert(`${this.myEaterName} is taken!!!`);
    }
    else {
      if (this.currentEaterName === '') {
        this.currentEaterName = String(this.myEaterName);
        localStorage.setItem('currentEaterName', this.currentEaterName);
        alert('Your name has been set!!!');
      }
      else {
        const eater = new Eater();
        eater.newName = String(this.myEaterName);
        eater.oldName = String(this.currentEaterName);
        this.schedulerSvc.changeEaterName(eater).subscribe(s => {
          this.scheduler = s;
          this.currentEaterName = String(this.myEaterName);
          localStorage.setItem('currentEaterName', this.currentEaterName);
          alert('Your name has been set!!!');
        });
      }
    }
  }

  isEaterNameRepeted(eaterName: string) {
    let result = false;
    let eaters = [];

    this.scheduler.groups.forEach(s => {
      eaters = s.eaters.filter(e => e.toLowerCase() === eaterName.toLowerCase());
      if (eaters.length > 0) {
        result = true;
      }
    });

    return result;
  }

  removeMe() {
    const hours = new Hours();
    let eaters = [];

    this.scheduler.groups.forEach(s => {
      eaters = s.eaters.filter(e => e.toLowerCase() === this.myEaterName.toLowerCase());
      if (eaters.length > 0) {
        hours.id = s.id;
        hours.eaters = eaters;
      }
    });

    this.schedulerSvc.removeEather(hours).subscribe(s => this.scheduler = s);
  }

  updatePage() {
    this.schedulerSvc.getSchedule().subscribe(s => this.setScheduler(s));
  }
}
