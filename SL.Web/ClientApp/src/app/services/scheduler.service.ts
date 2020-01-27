import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ControlException } from '../tools/control-exception';
import { ConfigurationFile } from '../entities/configuration-file';
import { SchedulerFile } from '../entities/scheduler-file';
import { Hours } from '../entities/hours';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  private schedulerURL: string;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private log: ControlException) {
    this.schedulerURL = 'https://slapi.azurewebsites.net/scheduler';
  }

  /**
   * Generic function for use http verb called GET.
   * @param url Resource to access.
   *
   * @return an `Observable`
   */
  private get<T>(url: string): Observable<any> {
    return this.http.get<T>(`${this.schedulerURL}${url}`).pipe(
      catchError(this.log.handleError<any>(`get ${url}`))
    );
  }

  /**
   * Generic function for use http verb called POST.
   * @param url Resource to access.
   *
   * @return an `Observable`
   */
  private post<T>(url: string, item: any): Observable<any> {
    return this.http.post<T>(`${this.schedulerURL}${url}`, item, this.httpOptions).pipe(
      catchError(this.log.handleError<any>(`post ${url}`))
    );
  }

  connectService() {
    return this.get('');
  }

  getConfigFile(): Observable<ConfigurationFile> {
    return this.get<ConfigurationFile>('/GetConfigFile');
  }

  setConfigFile(configFile: ConfigurationFile): Observable<ConfigurationFile> {
    return this.post<ConfigurationFile>('/SetConfigFile', configFile);
  }

  getSchedule(): Observable<SchedulerFile> {
    return this.get<SchedulerFile>('/GetSchedule');
  }

  setSchedule(schedulerFile: SchedulerFile): Observable<SchedulerFile> {
    return this.post<SchedulerFile>('/SetSchedule', schedulerFile);
  }

  AddEather(eater: Hours): Observable<SchedulerFile> {
    return this.post<SchedulerFile>('/AddEather', eater);
  }

  RemoveEather(eater: Hours): Observable<SchedulerFile> {
    return this.post<SchedulerFile>('/RemoveEather', eater);
  }
}