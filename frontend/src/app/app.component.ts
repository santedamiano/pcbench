import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PCBench';
  leaderboardEntries: any[] = [];
  cpuSearchQuery: string = ''; // Tracks search input strings

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchLeaderboard(); // Automatically pull data on page load
  }

  fetchLeaderboard() {
    let url = 'http://localhost:3000/api/leaderboard';
    
    // Append your query filter if text is entered
    if (this.cpuSearchQuery) {
      url += `?cpu=${encodeURIComponent(this.cpuSearchQuery)}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.leaderboardEntries = data;
      },
      error: (err) => {
        console.error('Failed to communicate with Express database API:', err);
      }
    });
  }
}
