import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIconModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})

export class RatingComponent implements OnInit{
  
  ngOnInit(): void {
    this.retingAnterior = this.radingSeleccionado;
  }
    
  @Input({required: true, transform: (valor: number)=> Array(valor).fill(0)})
  maximoRating!: number[];

  @Input()
  radingSeleccionado = 0;

  @Output()
  votado = new EventEmitter<number>();

  retingAnterior = 0;

  manejarMouseEnter(indice: number){
    this.radingSeleccionado = indice + 1;
  }

  manejarMouseLeave(){
    if (this.retingAnterior !== 0){
      this.radingSeleccionado = this.retingAnterior;
    } else {
      this.radingSeleccionado = 0;
    }
  }

  manejarClick(indice: number){
    this.radingSeleccionado = indice + 1;
    this.retingAnterior = this.radingSeleccionado;
    this.votado.emit(this.radingSeleccionado);
  }

}
