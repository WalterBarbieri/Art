import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {
  currentYear: number = 2025;
  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

}
