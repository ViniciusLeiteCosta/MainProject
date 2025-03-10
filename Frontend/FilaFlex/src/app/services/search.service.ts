import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8080/api/search';

  constructor(private http: HttpClient, private authService: AuthService) {}

  search(query: string): Observable<any[]> {
    const token = this.authService.getToken();
    
    // Se não tiver token, não faz a requisição
    if (!token) {
      console.error('Erro: Token JWT não encontrado.');
      return new Observable<any[]>(); 
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(`${this.apiUrl}?q=${query}`, { headers });
  }
}
