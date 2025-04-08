import { Component, inject, Input } from '@angular/core';
import { PaginacionDTO } from '../../modelos/PaginacionDTO';
import { SERVICIO_GRUD_TOKEN } from '../../proveedores/proveedores';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListadoGenericoComponent } from "../listado-generico/listado-generico.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IServicioCRUD } from '../../interfaces/IServicioCRUD';

@Component({
  selector: 'app-indice-entidad',
  imports: [RouterLink, MatButtonModule, ListadoGenericoComponent, MatTableModule, MatPaginatorModule, SweetAlert2Module],
  templateUrl: './indice-entidad.component.html',
  styleUrl: './indice-entidad.component.css'
})
export class IndiceEntidadComponent<TDTO, TCreacionDTO> {
  @Input({required : true})
  titulo!: string;

  @Input({required: true})
  rutaCrear!: string;

  @Input({required: true})
  rutaEditar!: string;

  @Input()
  columnasAMostrar = ['id', 'nombre', 'acciones'];

  servicioGRUD = inject(SERVICIO_GRUD_TOKEN) as IServicioCRUD<TDTO, TCreacionDTO>;
  
  paginacion: PaginacionDTO = {pagina: 1, recordsPorPagina: 5};
  entidades!: TDTO[];
  cantidadTotalRegistros!: number;

  constructor(){
    this.cargarRegistros();
  }
    
  actualizarPaginacion(datos: PageEvent){
    this.paginacion = {pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize};
    this.cargarRegistros();
  }
  
  cargarRegistros(){
    this.servicioGRUD.obtenerPaginado(this.paginacion).subscribe((repuesta: HttpResponse<TDTO[]>)=> {
      this.entidades = repuesta.body as TDTO[];
      const cabecera = repuesta.headers.get("cantidad-total-registros") as string;
      this.cantidadTotalRegistros = parseInt(cabecera, 10);
    })
  }

  borrar(id: number){
    this.servicioGRUD.borrar(id)
    .subscribe(() => {
      this.paginacion.pagina = 1;
      this.cargarRegistros();
    })
  }

  primeraLetraEnMayuscula(valor: string){
    if (!valor) return valor;
    return valor.charAt(0).toUpperCase() + valor.slice(1);
  }
}
