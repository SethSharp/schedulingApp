import { Component, OnInit, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-custom-day-block',
  templateUrl: './custom-day-block.component.html',
  styleUrls: ['./custom-day-block.component.scss'],
})
export class CustomDayBlockComponent implements OnInit {
  @Input() createSession: any;

  disableSelect = new FormControl(false);

  events: string[] = [];
  opened: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
