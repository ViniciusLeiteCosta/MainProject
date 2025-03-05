import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

export interface AppointmentType {
  id?: number;
  name: string;
  description: string;
  category: string[];
  price: number;
  estimatedTime: number;
  appointmentDate: string;
  requiredDocumentation: string[];
  address: {
    number: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentTypeService {
  private apiUrl = 'http://localhost:8080/appointment-types';

  constructor(private http: HttpClient) {}

  getAppointmentTypes(): Observable<AppointmentType[]> {
    return this.http.get<AppointmentType[]>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  getAppointmentTypeByName(name: string): Observable<AppointmentType> {
    return this.http.get<AppointmentType>(`${this.apiUrl}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  createAppointmentType(appointmentType: AppointmentType): Observable<AppointmentType> {
    console.log('Criando appointment type:', appointmentType);
    const appointmentTypeDTO = this.convertToDTO(appointmentType);
    
    //Adiciona o header Authorization com o token.
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    };
    
    return this.http.post<AppointmentType>(`${this.apiUrl}/create`, appointmentTypeDTO, { headers }).pipe(
      tap(response => console.log('Resposta da criação:', response)),
      catchError(this.handleError)
    );
  }

  updateAppointmentType(appointmentType: AppointmentType): Observable<AppointmentType> {
    console.log('Atualizando appointment type:', appointmentType);

    //Verifica se tem ID antes de tentar excluir
    if (!appointmentType.name) {
      console.error('Não é possível atualizar: nome não encontrado');
      return throwError(() => new Error('Nome não encontrado'));
    }

    return this.deleteAppointmentTypeByName(appointmentType.name)
      .pipe(
        tap(() => console.log('Appointment type excluído antes de atualizar')),
        switchMap(() => this.createAppointmentType(appointmentType)),
        catchError(this.handleError)
      );
  }

  private convertToDTO(appointmentType: AppointmentType): any {
    //Converter a data, se existir.
    let appointmentDate = null;
    if (appointmentType.appointmentDate) {
      appointmentDate = appointmentType.appointmentDate;
    }
    

    let adress = null;
    if (appointmentType.address) {
      adress = {
        number: appointmentType.address.number || '',  // Campo obrigatório
        street: appointmentType.address.street || '',  // Campo obrigatório
        city: appointmentType.address.city || '',      // Campo obrigatório
        state: appointmentType.address.state || '',    // Campo obrigatório
        country: appointmentType.address.country || '' // Campo obrigatório
      };
    }
    
    return {
      name: appointmentType.name,
      description: appointmentType.description,
      category: appointmentType.category || [],
      price: appointmentType.price || 0,
      estimatedTime: appointmentType.estimatedTime || 0,
      appointmentDate: appointmentDate,
      requiredDocumentation: appointmentType.requiredDocumentation || [],
      adress: adress
    };
  }
  
  deleteAppointmentTypeById(id: number): Observable<void> {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    };
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppointmentType(appointmentType: AppointmentType): Observable<void> {
    if (appointmentType.id) {
      const headers = { 
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      };
      
      return this.http.delete<void>(`${this.apiUrl}/${appointmentType.id}`, { headers }).pipe(
        catchError(this.handleError)
      );
    } 

    else if (appointmentType.name) {
      return this.deleteAppointmentTypeByName(appointmentType.name);
    } 
    else {
      console.error('Não é possível excluir: nem ID nem nome foram encontrados');
      return throwError(() => new Error('ID ou nome não encontrado'));
    }
  }

  deleteAppointmentTypeByName(name: string): Observable<void> {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    };

    return this.http.delete<void>(`${this.apiUrl}/delete/${name}`, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocorreu um erro na API:', error);
    return throwError(() => error);
  }
}