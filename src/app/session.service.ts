import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session';
import { GeneralFunctionsService } from "./Services/general-functions.service"

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  uri = 'http://localhost:4000';
  defaultTable = 'Timetable';

  constructor(
    private http: HttpClient,
    private gServ: GeneralFunctionsService
  ) {}

  // Use this to load different time tables...
  // Exam timetable
  collectionExists(c: string = this.defaultTable) {
    return this.http.get(`${this.uri}/tableExists/${c}`);
  }

  startTime = this.gServ.startTime;
  endTime = this.gServ.endTime;

  createTable(n: string = this.defaultTable) {
    // n => Name of the timetable...
    // use as a a week system, week 1-3, exam weeks 1 & 2
    let userSchema = {
      name: n,
      m: [new Session('', this.startTime, this.endTime)],
      t: [new Session('', this.startTime, this.endTime)],
      w: [new Session('', this.startTime, this.endTime)],
      th: [new Session('', this.startTime, this.endTime)],
      f: [new Session('', this.startTime, this.endTime)],
      s: [new Session('', this.startTime, this.endTime)],
      su: [new Session('', this.startTime, this.endTime)],
    };
    return this.http.post(`${this.uri}/createTable`, userSchema);
  }

  updateDay(newDay: any, title: string, table: string) {
    return this.http.post(`${this.uri}/addSession/${table}`, {
      d: newDay,
      title: title,
    });
  }

  retrieveTable(u: string = this.defaultTable) {
    return this.http.get(`${this.uri}/table/${u}`);
  }

  retrieveAllTables() {
    return this.http.get(`${this.uri}/getAllTables`);
  }

  deleteTable(t: string) {
    return this.http.delete(`${this.uri}/delete/${t}`);
  }
}
