import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/connection.service';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage {
  id: number;
  precio: number;
  ubicacion: string;
  estado: string;
  tipo_habitacion_id: number;
  capacidad: number;

  constructor(private router: Router, private restService: ConnectionService) {}

  crearHabitacion() {
    const mutation = `mutation {
      createHabitacion(createHabitacionInput:{
        id: ${this.id},
        precio: ${this.precio},
        ubicacion: "${this.ubicacion}",
        estado: "${this.estado}",
        tipo_habitacion_id: ${this.tipo_habitacion_id},
        capacidad: ${this.capacidad},
      }){
        id,
        precio,
        ubicacion,
        estado,
        tipo_habitacion_id,
        capacidad,
      }
    }`;

    this.restService.add(mutation).subscribe(
      (answer: any) => {
        Swal.fire({
          title: 'La habitación se creo de forma exitosa',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          width: '100%',
          padding: '2em',
          background: '#f6f6f6',
          position: 'center',
          heightAuto: false
        });
  
        this.id = null;
        this.precio = null;
        this.ubicacion = '';
        this.estado = '';
        this.tipo_habitacion_id = null;
        this.capacidad = null;
        this.router.navigate(['/rooms']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
