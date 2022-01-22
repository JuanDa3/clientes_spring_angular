import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      tap((response: any) => {

        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        )
      }),
      map((response: any) => {

        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        )
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire("Error al editar", e.error.mensaje, 'error')
        return throwError(() => new Error('error'));
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => new Error(e));
        }

        this.router.navigate(['/clientes']);
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => new Error('error'));
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => new Error('error'));
      })
    );
  }
}
