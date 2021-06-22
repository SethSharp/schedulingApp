
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
  testMonday: Session[] = [];
  days: Object[] = [];
  rowHeight = 100;
  height = 1500;
  startTime = 8;
  endTime = 23;
  breakTime = 15;

  ngOnInit(): void {
    // Temporarily adding sessions here, until modal is created
    this.createSesh();
  }

  createSesh() {
    // 25 => 15, it is a percentage
    this.testMonday.push(new Session('Breakfast', 10, 50));
    this.testMonday.push(new Session('Lunch', 12, 100));
    this.testMonday.push(new Session('Dinner', 18, 120));
    this.testMonday.push(new Session('After dinner', 20, 100));
    this.sortSessions(this.testMonday);
    this.days = [{ d: 'MON', sessions: this.testMonday }];
    this.addBlankSessions(this.testMonday);
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

  timeToPx(s: number) {
    return (s - 8) * this.rowHeight;
  }

  getAmount = (a: number, i: number, day: any) => {
    let level = this.timeToPx(a);
    let t = 0;
    if (i >= 1) {
      // Gets last end position
      t = this.timeToPx(day[i - 1].start) + day[i - 1].len;
    }
    let f = (level - t).toString();
    return f;
  };

  getHeight = (s: number) => {
    return s.toString();
  };

  // When the user clicks on a blank session. It will create a new one inserting at
  insertSession = (i: number, days: any) => {
    // Ranges for the modal to stay within
    let lRange = days[i].start;
    let uRange = lRange + days[i].len;
    let newData = new Session('TEST', 21, 100);
    days[i].len = this.timeToPx(newData.start) - this.timeToPx(days[i].start);
    // Adding in the new session, into the correct spot. After the break
    days.splice(i + 1, 0, newData);

    if (newData.start == days[i].start) {
      days.splice(i, 1);
      try {
        this.insertStartSesh(newData, days,i)
      } catch {
        this.insertEndSessionMatch(days, newData)
      }
    } else {
      // Now this can be a session being inserted at the end so need a catch
      try {
        this.insertMiddleSesh(days, i);
      } catch {
        this.insertEndSession(days, newData)
      }
    }
  };

  insertMiddleSesh(days: any, i: number) {
    // This is when there will be a session inserted, with a blank either side
    let nextDay = days[i + 2];
    let start = this.getEndTime(days[i + 1]);
    if (days[i + 2].start == start) return
    let end = this.timeToPx(nextDay.start) - this.timeToPx(start);
    let newBlank = new Session('A', start, end);
    days.splice(i, 0, newBlank);
  }

  insertStartSesh(newData: any, days:any, i: number) {
    // Sesh New Sesh Blank
    let endLen = this.getEndTime(newData); // Become new start
    let newBlank = new Session('A',endLen,this.timeToPx(days[i + 1].start) - this.timeToPx(endLen))
    days.splice(i, 0, newBlank);
  }

  insertEndSession(days:any, newData:any) {
    // Blank New Sesh (new blank or nothing)
    let start = this.getEndTime(newData);
    let end = this.height - this.timeToPx(start);
    if (start > this.endTime) return
    let newBlank = new Session('A', start, end);
    days.push(newBlank);
  }

  insertEndSessionMatch(days:any, newData:any) {
    let start = this.getEndTime(newData);
    let end = this.height - this.timeToPx(start);
    let newBlank = new Session('A', start, end);
    days.push(newBlank);
  }

  nextTime(day: any, i: number, s: number) {
    for (let j = i; j < day.length; j++) {
      if (day[j].title.length > 1) {
        if (day[j].start < s) continue;
        return day[j].start;
      }
    }
    return this.height;
  }

  // Used to create a general new session, using a modal to get information
  createSession = (index: number, day: any) => {
    console.log('Created a new session');
    // let data = new Session("test",10,10);
    // this.testMonday.splice(index, 0, data);
    // When the user clicks on the table it will use this index to insert a session
    // Will call insert session with the new information gained, from a modal or something...
  };
  addBlank = (day: any) => {
    console.log('Added a blank space');
    //When a insertion is added, need to add a session that is considered blank
    // CLickable as well so it
  };

  viewEditSession = (i: number) => {
    // View a session/edit the session details; time, title, notes?...
    console.log('CLicked ' + i);
  };

  // When creating a session, a blank session will fille the gaps where there are none
  // Just so its easy for the user to click on a blank session to insert a new one a that time
  addBlankSessions(day: any) {
    let blanks: Session[] = [];
    for (let i = 0; i < day.length; i++) {
      // break time is a const amount of time between each session, since beginning no need...
      // Beginning of day check
      if (i == 0) {
        if (day[i].start - this.startTime > 0) {
          let data = new Session(
            '1',
            8,
            this.rowHeight * (day[i].start - this.startTime)
          );
          blanks.push(data);
        }
      } else {
        if (day[i].start - day[i - 1].start > 0) {
          let s = day[i - 1].start + day[i - 1].len / 100;
          let a = this.timeToPx(day[i].start);
          let b = this.timeToPx(s);
          let data = new Session('2', s, a - b);
          blanks.push(data);
        }
      }
    }
    let i = day.length - 1;
    let s = day[i].start + day[i].len / 100;
    let data = new Session('3', s, this.height - this.timeToPx(s));
    blanks.push(data);
    this.insertBlanks(day, blanks);
  }

  getEndTime(day: any) {
    return day.start + day.len / 100;
  }

  insertBlanks(day: any, blanks: any) {
    for (let i = 0; i < blanks.length; i++) {
      for (let j = 0; j < day.length; j++) {
        if (day[j].start > blanks[i].start) {
          day.splice(j, 0, blanks[i]);
          break;
        }
      }
      if (blanks[i].start > day[day.length - 1].start) day.push(blanks[i]);
    }
  }

  getTimeLength(i: number, day: any) {
    let x = this.timeToPx(day[i].start);
    let y = this.timeToPx(day[i + 1].start);
    return y - x;
  }

  // Sorts a session array based on their starting times...
  sortSessions(session: any) {
    for (let i = 0; i < session.length; i++) {
      if (session[i].title.length == 1) {
        session.splice(i, 1);
        continue;
      }
      for (let j = 0; i < session.length && i != j; j++) {
        if (session[i].start < session[j].start) {
          let temp = session[j];
          session[j] = session[i];
          session[i] = temp;
        }
      }
    }
  }
}
