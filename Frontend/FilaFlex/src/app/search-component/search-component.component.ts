import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
})
export class SearchComponent {
  searchQuery: string = '';
  results: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private searchService: SearchService) {}

  search() {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Digite algo para pesquisar!';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.searchService.search(this.searchQuery).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar:', error);
        this.errorMessage = 'Erro ao buscar resultados';
        this.isLoading = false;
      }
    });
  }
  
}
