
import { Component, OnInit } from '@angular/core';
import { Session } from './session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Future use some sort of storage and service
  // Use some objects to store each session (time, title, length, info etc)
  testMonday : Session[] = [];
  days: Object[] = [];
  rowHeight = 100

  ngOnInit(): void {
    this.createSesh();
  }

  createSesh() {
    // 25 => 15, it is a percentage
    this.testMonday.push(new Session("BREAKY", 8, 25))
    this.testMonday.push(new Session('LUNCHG', 12, 25));
    this.testMonday.push(new Session('MID', 10, 25));
    this.testMonday.push(new Session('WORK', 15, 50));
    this.testMonday.push(new Session("Something", 11, 50))
    this.testMonday.push(new Session('Work', 16, 200));
    this.sortSessions(this.testMonday)
    this.days = [{d:'MON',sessions:this.testMonday}];
  }

  times = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
  ];
  headerContent = [
    { t: 'TIME', s: 1 },
    { t: 'MON', s: 2 },
    { t: 'TUE', s: 2 },
    { t: 'WED', s: 2 },
    { t: 'THUR', s: 2 },
    { t: 'FRI', s: 2 },
    { t: 'SAT', s: 2 },
    { t: 'SUN', s: 2 },
  ];


  lengths = [30, 60, 90];
  breaks = [5, 90, 17];

  createTimeRow() {
    let row = [];
    for (let i = 0; i < 7; i++) row.push('');
    return row;
  }

  getPos(s:number) { return (s - 8) * this.rowHeight; }

  getAmount = (a: number, i:number, day:any) => {
    let level = this.getPos(a)
    let t = 0
    if (i>=1) {
      // Gets last end position
      t=this.getPos(day[i-1].start) + day[i-1].len
    }
    let f = (level-t).toString();
    return f
  }

  getHeight = (s: number) => {
    return (s).toString();
  }

  insertSession = (day:any, content:any) => {
    console.log("Inserted a session")
    day.push(content)
    // Need to insert a session with some parameters
  }

  addBlank = (day:any) => {
    console.log("Added a blank space")
    //When a insertion is added, need to add a session that is considered blank
    // CLickable as well so it
  }

  createSession = (index:number, day:any) => {
    console.log("Created a new session")
    // When the user clicks on the table it will use this index to insert a session
    // Will call insert session with the new information gained, from a modal or something...
  }

  // Sorts a session array based on their starting times...
  sortSessions(session: any) {
    for (let i = 0; i < session.length; i++) {
      for (let j = 0; i < session.length && i!=j; j++) {
        if (session[i].start < session[j].start) {
          let temp = session[j];
          session[j] = session[i];
          session[i] = temp;
        }
      }
    }
  }

}
