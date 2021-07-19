import { Item } from './item';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session';
import { GeneralFunctionsService } from "./Services/general-functions.service"
import { Observable } from 'rxjs';
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

  setWeek(newWeek: any, table: string) {
    return this.http.post(`${this.uri}/updateWeek/${table}`, newWeek);
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

  // To Do List functions
  listExists(id: any) {
    return this.http.get(`${this.uri}/listExists/${id}`);
  }

  createList(l: string) {
    let list = {
      title: l,
      completed: [new Item('Testing completed items', 'Complete items')],
      inCompleted: [new Item('Testing in complete', 'In complete items')],
    };
    return this.http.post(`${this.uri}/createList`, list);
  }

  retrieveList(title: string) {
    return this.http.get(`${this.uri}/getToDoList/${title}`);
  }

  addItem(item: any, id: any) {
    return this.http.post(`${this.uri}/addItem/${id}`, item);
  }

  updateItem(newItem: any, i: number, day: string) {
    return this.http.post(`${this.uri}/updateItem/${day}`, {
      updatedItem: newItem,
      pos: i,
    });
  }

  completeItem(i: number, day: string) {
    return this.http.post(`${this.uri}/completeItem/${day}`, {
      i: i,
    });
  }

  moveItem(i: number, day: string) {
    return this.http.post(`${this.uri}/moveItem/${day}`, { i: i });
  }

  deleteItem(i: number, day: string) {
    return this.http.post(`${this.uri}/deleteItem/${day}`, { i: i });
  }

  // Categories

  getCategories() {
    return this.http.get(`${this.uri}/getCategories`);
  }

  addCategory(category: any) {
    return this.http.post(`${this.uri}/addCategory`, category);
  }

  editCategory(oldC: any, newC: any) {
    return this.http.post(`${this.uri}/editCategory`, {
      o: oldC.title,
      n: newC,
    });
  }

  deleteCategory(c: any) {
    return this.http.delete(`${this.uri}/deleteCategory/${c}`);
  }
}
