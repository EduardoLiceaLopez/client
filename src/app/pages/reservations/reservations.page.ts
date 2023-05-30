import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/connection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  numHuespedes: number;
  fechaInicio: string;
  fechaFinal: string;
  mostrarConsultarReserva: boolean;
  monto: number;
  periodo: number;
  id: number;
  idReservacion: number;

  constructor(private restService: ConnectionService) {
    this.numHuespedes = 0;
    this.fechaInicio = '';
    this.fechaFinal = '';
    this.mostrarConsultarReserva = false;
  }

  ngOnInit() {}

  reserve() {
    const fechaInicioFormatted = new Date(this.fechaInicio).toISOString().split('T')[0];
    const fechaFinalFormatted = new Date(this.fechaFinal).toISOString().split('T')[0];

    const mutation = `mutation {
      createReservacion(createReservacionInput:{
        num_huespedes: ${this.numHuespedes},
        fecha_inicio: "${fechaInicioFormatted}",
        fecha_final: "${fechaFinalFormatted}"
      }){
        id,
        fecha_reserva,
        periodo,
        monto,
        id,
        habitacion{
          precio
          ubicacion
        }
        usuario{
          nombre,
          apPaterno,
          apMaterno
        }
      }
    }`;

    this.restService.add(mutation).subscribe(
      (response: any) => {
        if (response.data && response.data.createReservacion) {
          const reserva = response.data.createReservacion;
          this.mostrarConsultarReserva = true;
          Swal.fire({
            title: 'Reserva creada con éxito',
            icon: 'success',
            html: `
              <h3>Detalles de la reserva:</h3>
              <p>Número de reservación: ${reserva.id}</p>
              <p>Nombre del titular: ${reserva.usuario.nombre} ${reserva.usuario.apPaterno} ${reserva.usuario.apMaterno}</p>
              <p>Precio por noche: ${reserva.habitacion.precio}</p>
              <p>Ubicación: ${reserva.habitacion.ubicacion}</p>
              <p>Número de huéspedes: ${reserva.num_huespedes}</p>
              <p>Llegada: ${fechaInicioFormatted}</p>
              <p>Salida:${fechaFinalFormatted}</p>
              <p>Total: ${reserva.monto}</p>
            `,
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        } else {
          console.log('Error en la respuesta del servidor:', response);
          Swal.fire({
            title: 'La reservación no se pudo concretar, debido a que no hay habitaciones disponibles',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        }
      },
      (error: any) => {
        console.log('Error en la solicitud:', error);
      }
    );
  }

  //
  consultar() {
    const query = `query {
      usuario {
        nombre
        apPaterno
        apMaterno
        reservaciones {
          id
          periodo
          monto
          num_huespedes
          fecha_reserva
          fecha_inicio
          fecha_final
          habitacion {
            id
            tipohabitacion {
              tipo
            }
            precio
            ubicacion
          }
        }
      }
    }`;
  
    this.restService.getAll<any>(query).subscribe(
      (response) => {
        if (response.data && response.data.usuario.reservaciones) {
          const reservas = response.data.usuario.reservaciones;
          let detallesReservas = '';
  
          reservas.forEach((reserva: any) => {
            detallesReservas += `
              <h3>Detalles de la reserva:</h3>
              <p>Número de reservación: ${reserva.id}</p>
              <p>Nombre del titular: ${response.data.usuario.nombre} ${response.data.usuario.apPaterno} ${response.data.usuario.apMaterno}</p>
              <p>Precio por noche: ${reserva.habitacion.precio}</p>
              <p>Ubicación: ${reserva.habitacion.ubicacion}</p>
              <p>Fecha de llegada: ${reserva.fecha_inicio}</p>
              <p>Fecha de salida: ${reserva.fecha_final}</p>
              <p>Total: ${reserva.monto}</p>
              <hr>
            `;
          });
  
          Swal.fire({
            title: 'Consultar Reserva',
            icon: 'success',
            html: detallesReservas,
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        } else {
          console.log('Error en la respuesta del servidor:', response);
          Swal.fire({
            title: 'Error al consultar las reservas',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        }
      },
      (error: any) => {
        console.log('Error en la solicitud:', error);
      }
    );
  }  
  
  eliminarReservacion() {
    const mutation = `
    mutation {
      removeReservacion(id: ${this.idReservacion}) 
    }
  `;  

    this.restService.add(mutation).subscribe(
      (response: any) => {
        if (response.data && response.data.removeReservacion) {
          Swal.fire({
            title: 'Reservación eliminada con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        } else {
          console.log('Error en la respuesta del servidor:', response);
          const errorMessage = response.errors[0].message
          Swal.fire({
            title: 'Reservación no eliminada con éxito',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        }
      },
      (error: any) => {
       
      }
    );
  }
}