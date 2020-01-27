import { Component, OnInit } from '@angular/core';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { SchedulerFile } from 'src/app/entities/scheduler-file';
import { ConfigurationFile } from 'src/app/entities/configuration-file';
import { Hours } from 'src/app/entities/hours';

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
  }

  setScheduler(scheduler: SchedulerFile) {
    this.schedulerSvc.setSchedule(scheduler).subscribe(s => this.scheduler = s);
  }

  addEater(group: Hours) {
    if (this.myEaterName && group.eaters.length < this.configuration.capacity) {
      const objEater = new Hours();
      objEater.id = group.id;
      objEater.eaters = [];
      objEater.eaters.push(this.myEaterName);
      this.schedulerSvc.AddEather(objEater).subscribe(s => this.scheduler = s);
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
      }
      else {
        console.log(this.currentEaterName, this.myEaterName);
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
}
