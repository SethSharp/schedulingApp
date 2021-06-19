import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-day-table',
  templateUrl: './day-table.component.html',
  styleUrls: ['./day-table.component.scss'],
})

export class DayTableComponent implements OnInit {

  @Input() day:any;
  @Input() getAmount:any;
  @Input() getHeight:any;

  constructor() { }

  ngOnInit(): void {
  }

  test(n:number) {
    console.log("Clicked " + n)
  }

}
