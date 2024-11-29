import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-clients',
  standalone: false,
  
  templateUrl: './credit-clients.component.html',
  styleUrl: './credit-clients.component.css'
})
export class CreditClientsComponent {
  constructor(private router:Router){}
  credits: any[] = [];
  clients: any[] = [];
  selectedClient: any = null;
  showPopup = false;

  clientForm = {
    name: '',
    credit: {
      product: '',
      creditDate: '',
      description: '',
      amount: 0,
      dueDate: ''
    }
  };

  showAddClientPopup() {
    this.showPopup = true;
  }

  hidePopup() {
    this.showPopup = false;
  }

  addClient() {
    const newClient = {
      name: this.clientForm.name,
      credits: [{ ...this.clientForm.credit }]
    };
    this.clients.push(newClient);
    this.hidePopup();
    this.clientForm = {
      name: '',
      credit: {
        product: '',
        creditDate: '',
        description: '',
        amount: 0,
        dueDate: ''
      }
    };
  }

  viewCredits(client: any) {
    this.selectedClient = client;
  }

  deleteClient(client: any) {
    this.clients = this.clients.filter(c => c !== client);
    if (this.selectedClient === client) {
      this.selectedClient = null;
    }
  }

  calculateTotalCredits(credits: any[]): number {
    return credits.reduce((total, credit) => total + credit.amount, 0);
  }

  // Supprimer un crédit
  deleteCredit(credit: any) {
    this.credits = this.credits.filter(c => c !== credit);
  }

  // Modifier un crédit (à implémenter selon vos besoins)
  editCredit(credit: any) {
    this.clientForm = { ...credit };
    this.editCredit(credit);
  }
  
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  searchQuery: string = ''; // Requête de recherche
filteredClients: any[] = []; // Liste des clients filtrés

ngOnInit() {
  this.filteredClients = this.clients; // Initialiser avec tous les clients
}

filterClients(): void {
  this.filteredClients = this.clients.filter(client =>
    client.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
}

  // Effacer le formulaire
  clearForm() {
    this.clientForm = {
      name: '',
      credit:{
      product: '',
      creditDate: '',
      description: '',
      amount: 0,
      dueDate: ''
      }
    };
  }

}
