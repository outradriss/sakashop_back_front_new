import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environnement.prod';

@Component({
  selector: 'app-open-caisse',
  standalone: false,
  
  templateUrl: './open-caisse.component.html',
  styleUrl: './open-caisse.component.css'
})
export class OpenCaisseComponent {
  isInputVisible: boolean = false; // Pour afficher/cacher l'input
  cashAmount: number = 0; // Stocke le montant saisi
  totalSales: number = 0; // Fond de caisse total
  isPrinting: boolean= false;

  constructor(private router: Router , private http : HttpClient) {}

  showInput(): void {
    this.isInputVisible = true;
  }


  saveCashAmount(): void {
    if (this.cashAmount > 0) {
      localStorage.setItem('cashAmount', this.cashAmount.toString());
      this.totalSales = this.cashAmount; // Mise à jour du fond de caisse
      this.isInputVisible = false;

      if (!this.isPrinting) {
        this.isPrinting = true;

        this.openCaisse().then(() => {
          this.isPrinting = false;
          console.log("✅ Impression terminée. Redirection en cours...");
          this.router.navigate(['/caisse/list']); // ✅ Redirection après impression complète
        });
      }
    } else {
      alert('Veuillez entrer un montant valide !');
    }
  }

  async openCaisse(): Promise<void> {
    const now = new Date();
    const ticketContent = `
==============================
🏪 CAISSE : BAGGAGIO
📍 Dépot : BAGGAGIO
------------------------------
📅 Ouverture : ${now.toLocaleString()}
💰 Fond de caisse : ${this.totalSales.toFixed(2)} MAD
------------------------------
✅ Bon travail !
==============================
    `;

    // ✅ Envoie le ticket au backend et attend la réponse avant de naviguer
    return new Promise((resolve, reject) => {
      
      this.http.post(`${environment.apiUrl}/api/print/ticket`, ticketContent, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('✅ Réponse du backend :', response);
            resolve(); // ✅ Confirmation que l'impression est terminée
          },
          error: (error) => {
            console.error('❌ Erreur lors de l\'envoi du ticket au backend :', error);
            alert('Erreur lors de l\'envoi du ticket. Vérifiez votre connexion ou le backend.');
            reject(error);
          }
        });
    });
  }
  
}
