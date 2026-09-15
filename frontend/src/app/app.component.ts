import { Component, OnInit } from '@angular/core';

interface Benchmark {
  buildName: string;
  cpu: string;
  gpu: string;
  ram: string;
  game: string;
  averageFPS: number;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'frontend';

  benchmark: Benchmark | null = null;

  async ngOnInit() {
    const response = await fetch('http://localhost:3000/api/benchmark');
    this.benchmark = await response.json();
  }
}