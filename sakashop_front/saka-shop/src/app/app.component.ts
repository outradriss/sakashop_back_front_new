import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'saka-shop';

  ngOnInit(): void {
      this.openFullScreen();
  }

  openFullScreen(): void {
    const elem = document.documentElement; // Sélectionne l'élément principal du document
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      // Safari
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      // IE11
      (elem as any).msRequestFullscreen();
    }
  }
}
