import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ListadoPeliculasComponent } from '../listado-peliculas/listado-peliculas.component';
import { Filtropeliculas } from './filtroPelicula';

import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GeneroDTO } from '../../generos/generos';
import { PeliculaDTO } from '../peliculas';
import { GenerosService } from '../../generos/generos.service';
import { PeliculasService } from '../peliculas.service';
import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-filtro-peliculas',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ListadoPeliculasComponent,
    MatPaginatorModule
  ],
  templateUrl: './filtro-peliculas.component.html',
  styleUrl: './filtro-peliculas.component.css',
})
export class FiltroPeliculasComponent implements OnInit {

  generosService = inject(GenerosService);
  peliculasService = inject(PeliculasService);
  paginacion: PaginacionDTO = {pagina: 1, recordsPorPagina: 10};
  cantidadTotalRegistros!: number;

  ngOnInit(): void {

    this.generosService.obtenerTodos().subscribe(generos => {
      this.generos = generos;

      this.leerValoresURL();
      this.buscarPeliculas(this.form.value as Filtropeliculas); 

      this.form.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((valores) => {
        console.log(valores);
        this.buscarPeliculas(valores as Filtropeliculas);
        this.escribirParametrosBusquedaEnURL(valores as Filtropeliculas);     
      });    
    });
  }

  buscarPeliculas(valores: Filtropeliculas) {
    valores.pagina = this.paginacion.pagina;
    valores.recordsPorPagina = this.paginacion.recordsPorPagina;
    
    this.peliculasService.filtrar(valores).subscribe(respuesta => {
      this.peliculas = respuesta.body as PeliculaDTO[];
      const cabecera = respuesta.headers.get('cantidad-total-registros') as string;
      this.cantidadTotalRegistros = parseInt(cabecera, 10);
    })
  }

  escribirParametrosBusquedaEnURL(valores: Filtropeliculas) {
    let queryString = [];

    if (valores.titulo) {
      //queryString.push(`titulo = ${encodeURIComponent(valores.titulo)}`); No se debe dejar espacios muy importante 
      queryString.push(`titulo=${encodeURIComponent(valores.titulo)}`);
    }

    if (valores.generoId !== 0) {
      queryString.push(`generoId=${valores.generoId}`);
    }

    if (valores.proximosEstrenos) {
      queryString.push(`proximosEstrenos=${valores.proximosEstrenos}`);
    }

    if (valores.enCines) {
      queryString.push(`enCines=${valores.enCines}`);
    }

    this.location.replaceState('peliculas/filtrar', queryString.join('&'));
  }

  leerValoresURL() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      var objeto: any = {};

      if (params.titulo) {
        objeto.titulo = params.titulo;
      }

      if (params.generoId) {
        objeto.generoId = Number(params.generoId);
      }

      if (params.proximosEstrenos) {
        objeto.proximosEstrenos = params.proximosEstrenos;
      }

      if (params.enCines) {
        objeto.enCines = params.enCines;
      }

      this.form.patchValue(objeto);
    });
  }

  limpiar() {
    this.form.patchValue({
      titulo: '',
      generoId: 0,
      proximosEstrenos: false,
      enCines: false,
    });
  }

  actualzarPaginacion(datos: PageEvent){
    this.paginacion = {pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize};
    this.buscarPeliculas(this.form.value as Filtropeliculas);
  }

  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  form = this.formBuilder.group({
    titulo: '',
    generoId: 0,
    proximosEstrenos: false,
    enCines: false,
  });

  generos!: GeneroDTO[];
  
  peliculas!: PeliculaDTO[];
}
