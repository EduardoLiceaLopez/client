import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  isCliente: boolean;
  isAdmin: boolean;
  isRecepcionista: boolean;

  constructor(private cookieService: CookieService, private router: Router) {
    this.isCliente = false;
    this.isAdmin = false;
    this.isRecepcionista = false;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = this.cookieService.get('access_token'); // Obtener el token de la cookie

    let req = request.clone();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Verificar si el token ha expirado
      const tokenTime: number | null = parseInt(localStorage.getItem('tokenTime') ?? '0', 10);
      if (tokenTime && (Date.now() - tokenTime) / 1000 > 3600) {
        localStorage.removeItem('tokenTime');
        this.cookieService.delete('access_token'); // Eliminar la cookie 'access_token'
        this.router.navigate(['/login']);
      }
      if (!tokenTime) {
        localStorage.setItem('tokenTime', Date.now().toString());
      }
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(err);
      })
    );
  }

  handleResponse(response: any) {
    const userRoleHeader = response.headers.get('X-User-Role');
    if (userRoleHeader) {
      const userRole = userRoleHeader.toLowerCase();
      if (userRole === 'cliente') {
        this.isCliente = true;
      } else if (userRole === 'admin') {
        this.isAdmin = true;
      } else if (userRole === 'trabajador') {
        this.isRecepcionista = true;
      }
      console.log('Rol del usuario:', userRole);
    }

    // Resto del código
  }
}