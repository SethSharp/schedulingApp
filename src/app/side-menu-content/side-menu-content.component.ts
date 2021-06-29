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

  isSelected: any;
  opened: boolean = true;

  startTime: Date = new Date();
  endTime: Date = new Date();
  min: Date = new Date();
  max: Date = new Date();

  break = 0;
  warning = '';
  title='lk'
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
    console.log(this.days)
    this.isSelected = true;
    let warning = this.fitIntoDay(this.startTime, this.endTime, this.editDay)
    if (warning != '') {
      this.warning = "Warning: " + warning
    } else {
      this.warning = ""
    }
  }

  // Return true to fit, false it doesn't
  fitIntoDay(start: Date, endTime: Date, s: any) {
    let w = ''
    if (s.sessions==null) return
    let sessions = s.sessions;
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].title != '') continue
      // From this point working in a blank slot
      if (sessions[i].start <= start.getHours()+start.getMinutes()/100) {

        let sesEnd = new Date()
        sesEnd.setHours(sessions[i].start)
        sesEnd.setMinutes(this.gServ.convertPxToTime(sessions[i].len));

        if (sesEnd < endTime) {
          w = "Too long"
        } else {
          console.log(sesEnd)
          this.addSession(i, sessions)
          return ''
        }
      } else {
        w="Session overlap/alreay exists"
        continue }
    }
    return w
  }

  setDay(day: any) {
    this.editDay = day;
  }

  addSession(i:number, session:any) {
    let obj = this.gServ.createNewSessionObject(this.title, this.startTime, this.endTime)
    let newS = new Session(obj.t, obj.s, obj.l)
    this.createSesh(i, session, newS)
  }

  changeBreak() {}
}
