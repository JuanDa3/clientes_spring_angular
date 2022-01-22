import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente()
  public titulo: string = "Crear Cliente";
  public errores: string[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire("Cliente guardado", `Cliente ${cliente.nombre} creado con exito`, 'success')
      }, err => {
        this.errores = err.error.errors as string[];
        console.log('Código de error desde el backend: ' + err.error.errors);
        console.log(err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success')
      }, err => {
        this.errores = err.error.errors as string[];
        console.log('Código de error desde el backend: ' + err.error.errors);
        console.log(err.error.errors);
      }
    )
  }

}
