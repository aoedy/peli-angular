import { Component, ComponentRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SERVICIO_GRUD_TOKEN } from '../../proveedores/proveedores';
import { Router } from '@angular/router';
import { extraerErrores } from '../../funciones/extraerErrores';
import { IServicioCRUD } from '../../interfaces/IServicioCRUD';
import { MostrarErroresComponent } from "../mostrar-errores/mostrar-errores.component";
import { CargandoComponent } from "../cargando/cargando.component";

@Component({
  selector: 'app-editar-entidad',
  imports: [MostrarErroresComponent, CargandoComponent],
  templateUrl: './editar-entidad.component.html',
  styleUrl: './editar-entidad.component.css'
})
export class EditarEntidadComponent<TDTO, TCreacionDTO> implements OnInit{
  ngOnInit(): void {
    this.servicioCRUD.obtenerPorId(this.id).subscribe(entidad => {
      this.cargarComponente(entidad);
    })
  }

  cargarComponente(entidad: any){
    if (this.contenedorFormulario){
      this.componenteRef = this.contenedorFormulario.createComponent(this.formulario);
      this.componenteRef.instance.modelo = entidad;
      this.componenteRef.instance.posteoFormulario.subscribe((entidad: any) => {
        this.guardarCambios(entidad);
      })

      this.cargando = false;
    }
  }

  @Input()
  id!: number;

  @Input({required: true})
  titulo!: string;

  @Input({required: true})
  rutaIndice!: string;

  @Input({required: true})
  formulario: any;

  errores: string[] = [];

  servicioCRUD = inject(SERVICIO_GRUD_TOKEN) as IServicioCRUD<TDTO, TCreacionDTO>;
  private router = inject(Router);
  cargando = true;

  @ViewChild('contenedorFormulario', {read: ViewContainerRef})
  contenedorFormulario!: ViewContainerRef;

  private componenteRef!: ComponentRef<any>;

  guardarCambios(entidad: TCreacionDTO){    
    this.servicioCRUD.actualizar(this.id, entidad).subscribe({
      next: () => {
        this.router.navigate([this.rutaIndice]);
      },
      error: err => {
        const errores = extraerErrores(err);
        this.errores = errores;
      }
    });
  }
}
