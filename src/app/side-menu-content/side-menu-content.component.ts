import { Session } from './../session';
import { GeneralFunctionsService } from '../Services/general-functions.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-menu-content',
  templateUrl: './side-menu-content.component.html',
  styleUrls: ['./side-menu-content.component.scss'],
})
export class SideMenuContentComponent implements OnInit {
  @Input() createSesh: any;
  @Input() days: any;
  @Input() tempSession: any;

  categories = {
    Food: '#00fff3',
    Study: '#09ff00',
    Work: '#ff6c00',
    Other: '#4800ff',
  };
  selectedCat = 'Select a category';
  selectedDay = 'Add a block on ...';
  color = 'black';

  startTime: Date = new Date();
  endTime: Date = new Date();
  min: Date = new Date();
  max: Date = new Date();

  warning = '';
  title = 'asd';
  day = null;
  editDay = [];

  constructor(private gServ: GeneralFunctionsService) {}

  ngOnInit(): void {
    this.min = this.gServ.setTime(8, 0);
    this.startTime = this.min;
    this.max = this.gServ.setTime(22, 59);
    this.endTime = this.max;
  }

  createSession() {
    let warning = this.fitIntoDay(this.startTime, this.endTime, this.editDay);
    if (warning != '') {
      this.warning = 'Warning: ' + warning;
    } else {
      this.warning = '';
    }
  }

  // Return true to fit, false it doesn't
  fitIntoDay(start: Date, endTime: Date, s: any) {
    let w = '';
    if (s.sessions == null) return;
    let sessions = s.sessions;
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].title != '') continue;
      // From this point working in a blank slot
      let x = start.getHours() + this.gServ.decTimeToTime(start.getMinutes());

      if (sessions[i].start <= x) {
        console.log(x);
        let sesEnd = new Date();
        sesEnd.setHours(sessions[i].start);
        sesEnd.setMinutes(
          this.gServ.convertPxToTime(sessions[i].len) +
            this.gServ.getHourDecimalToMinTime(sessions[i].start)
        );
        console.log(sesEnd)
        if (sesEnd < endTime) {
          w = 'Too long';
        } else {
          this.addSession(i, sessions);
          return '';
        }
      } else {
        w = 'Session overlap/alreay exists';
        continue;
      }
    }
    return w;
  }

  setDay(day: any) {
    this.editDay = day;
    this.selectedDay = day.d
  }

  addSession(i: number, session: any) {
    let obj = this.gServ.createNewSessionObject(
      this.title,
      this.startTime,
      this.endTime,
      this.selectedCat,
      this.color
    );
    this.createSesh(i, session, obj);
  }

  canSelectColour = true;
  setCat(c: any) {
    this.selectedCat = c.key;
    if (c.key == 'Other') this.canSelectColour = false;
    else {
      this.canSelectColour = true;
      this.color = c.value;
    }
  }
}
