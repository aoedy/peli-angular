import { Component, EventEmitter, Output } from '@angular/core';
import {icon, latLng, LeafletMouseEvent, marker, Marker, MarkerOptions, tileLayer } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Coordenada } from './Coordenada';

@Component({
  selector: 'app-mapa',
  imports: [LeafletModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css',
})
export class MapaComponent {
  @Output()
  coordenadaSeleccionada = new EventEmitter<Coordenada>();

  markerOptions: MarkerOptions = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
    }),
  };

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: latLng(-4.0225126700821745, -79.20691916479609),
  };

  capas: Marker<any>[] = [];

  manejarClick(event: LeafletMouseEvent) {
    const latitud = event.latlng.lat;
    const logitud = event.latlng.lng;

    this.capas = [];
    this.capas.push(marker([latitud, logitud], this.markerOptions));
    this.coordenadaSeleccionada.emit({ latitud, logitud });
  }
}
