import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { SchedulerFile } from 'src/app/entities/scheduler-file';
import { ConfigurationFile } from 'src/app/entities/configuration-file';
import { Hours } from 'src/app/entities/hours';
import { Eater } from 'src/app/entities/eater';

import * as signalR from '@aspnet/signalr';

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
  urlNotify = 'https://slapi.azurewebsites.net/scheduler/notify';
  //urlNotify = 'https://localhost:44337/scheduler/notify';

  constructor(private schedulerSvc: SchedulerService, private toastSvc: ToastrService) { }

  ngOnInit() {
    this.setListenerFromServer();
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

  setListenerFromServer() {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.urlNotify)
      .build();

    connection.start().then(() => {
      console.log('Connected');
    }).catch((err) => {
      return console.error(err.toString());
    });

    connection.on('BroadcastMessage', (eater: Eater, scheduler: SchedulerFile) => {
      this.scheduler = scheduler;
      if (eater.isOut && eater.newName !== '-none-') {
        this.toastSvc.info(`${eater.newName} has released a turn in the hour ${eater.hour}`, 'News!!!');
      }
      else if (eater.newName !== '-none-') {
        this.toastSvc.info(`${eater.newName} took the hour ${eater.hour}`, 'News!!!');
      }
    });
  }

  setScheduler(scheduler: SchedulerFile) {
    this.schedulerSvc.setSchedule(scheduler).subscribe(s => this.scheduler = s);
  }

  addEater(group: Hours) {
    if (this.myEaterName && group.eaters.length < this.configuration.capacity) {
      if (this.isEaterNameRepeted(this.myEaterName)) {
        this.toastSvc.success('You have already schedule your hour for lunch!!!', `Dear ${this.myEaterName}`);
      }
      else {
        const objEater = new Hours();
        objEater.id = group.id;
        objEater.eaters = [];
        objEater.eaters.push(this.myEaterName);
        this.schedulerSvc.addEather(objEater).subscribe(s => this.scheduler = s);
        this.toastSvc.success('You got a turn in the dinner!!!', `Dear ${this.myEaterName}`);
      }
    }
    else {
      this.toastSvc.warning('Eater name is required!!!', '');
    }
  }

  setMyEaterName() {
    if (this.isEaterNameRepeted(this.myEaterName)) {
      this.toastSvc.warning(`${this.myEaterName} is taken!!!`, '');
    }
    else {
      if (this.currentEaterName === '') {
        this.currentEaterName = String(this.myEaterName);
        localStorage.setItem('currentEaterName', this.currentEaterName);
        this.toastSvc.warning('Your name has been set!!!', this.currentEaterName);
      }
      else {
        const eater = new Eater();
        eater.newName = String(this.myEaterName);
        eater.oldName = String(this.currentEaterName);
        this.schedulerSvc.changeEaterName(eater).subscribe(s => {
          this.scheduler = s;
          this.currentEaterName = String(this.myEaterName);
          localStorage.setItem('currentEaterName', this.currentEaterName);
          this.toastSvc.warning('Your name has been set!!!', this.currentEaterName);
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

    this.schedulerSvc.removeEather(hours).subscribe(s => {
      this.scheduler = s;
      this.toastSvc.success('You have been removed of the list to get lunch!!!', `Dear ${this.myEaterName}`);
    });
  }

  updatePage() {
    this.schedulerSvc.getSchedule().subscribe(s => this.setScheduler(s));
  }
}
