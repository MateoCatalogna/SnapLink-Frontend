import { CommonModule } from '@angular/common';
import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  originalUrl: string = ''; 
  shortUrl: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  copied: boolean = false;


  acortar() {
    if (!this.originalUrl) return;

    this.loading = true;
    this.error = null;
    this.shortUrl = null;

    this.http.post<any>('http://localhost:3000/short-url', { 
      originalUrl: this.originalUrl 
    }).subscribe({
      next: (response) => {
        console.log('El Backend respondió:', response);

        if (response.shortUrl) {
            
            this.shortUrl = `http://localhost:3000/short-url/${response.shortUrl}`;
            
        } else {
            console.error('ERROR: No encuentro shortCode en la respuesta');
            this.error = 'El servidor no devolvió un código válido.';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error de conexión con el servidor.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  copiar() {
    if (this.shortUrl) {
      navigator.clipboard.writeText(this.shortUrl);
      
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}


