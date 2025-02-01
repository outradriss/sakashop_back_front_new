import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddCaisseService } from '../service/add-caisse.service';
import { CaisseStockService } from '../service/CaisseStock.service';

@Component({
  selector: 'app-gestion-caisse',
  standalone: false,
  
  templateUrl: './gestion-caisse.component.html',
  styleUrl: './gestion-caisse.component.css'
})
export class GestionCaisseComponent {

  isAddCaissePopupVisible = false;
  addCaisseForm: FormGroup;
  caisses: any[] = [];
  isSubmitting = false;
  selectedCaisseName: string = ''; 
  cachedProducts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private addCaisseService: AddCaisseService,
    private caisseStockService : CaisseStockService
  ) {
    this.addCaisseForm = this.fb.group({
      nom: ['', Validators.required],
      pays: ['', Validators.required],
      ville: ['', Validators.required],
      utilisateur: ['', Validators.required],
      password: ['', Validators.required],
      role: [{ value: 'CAISSIER', disabled: true }] // Champ readonly
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['selectedProducts']) {
      this.cachedProducts = navigation.extras.state['selectedProducts'];
      this.isAddCaissePopupVisible = true; // Réouvrir le popup
    }
  }

  ngOnInit(): void {
    this.loadCaisses(); // Charger les caisses au démarrage
  }

  loadCaisses(): void {
    this.addCaisseService.getCaisses().subscribe(
      (response: any[]) => {
        this.caisses = response; // Stocker les caisses récupérées
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des caisses :', error);
      }
    );
  }

  openAddCaissePopup(): void {
    this.isAddCaissePopupVisible = true;
  }

  closeAddCaissePopup(): void {
    this.isAddCaissePopupVisible = false;
    this.addCaisseForm.reset();
  }

  submitAddCaisse(): void {
    
    if (this.addCaisseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Empêche la soumission multiple
      const newCaisse = this.addCaisseForm.getRawValue();
  
      this.addCaisseService.addCaisse(newCaisse).subscribe(
        (response: any) => {
          console.log('Caisse ajoutée avec succès :', response);
          this.closeAddCaissePopup(); // Fermer le popup après l'ajout
          this.loadCaisses(); // Recharger les caisses après ajout
          this.isSubmitting = false; // Réactiver le bouton
        },
        (error: any) => {
          console.error("Erreur lors de l'ajout de la caisse :", error);
          this.isSubmitting = false; // Réactiver le bouton en cas d'erreur
        }
      );
    }
  }
  

  editCaisse(caisse: any): void {
    console.log('Modifier caisse:', caisse);
  }

  deleteCaisse(caisse: any): void {
   // this.caisses = this.caisses.filter((c) => c.id !== caisse.id);
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  navigateToStock(caisseName: string): void {
    this.selectedCaisseName = caisseName; // Stocker le nom pour référence locale
    this.router.navigate(['/stock-caisse'], { queryParams: { caisseName } }); // Naviguer avec le nom de la caisse
  }
  
  handleStockSaved(products: any[]): void {
    this.cachedProducts = products; // Stocker les produits enregistrés
    this.isAddCaissePopupVisible = true; // Rouvrir le popup "Ajouter Caisse"
  }
  openStockManagement(): void {
    const caisseName = this.addCaisseForm.get('nom')?.value;
    if (caisseName) {
      // Stocker les produits dans le service partagé
      this.caisseStockService.setCachedProducts(this.cachedProducts);
  
      // Naviguer vers le composant avec le nom de la caisse
      this.router.navigate(['/stock-caisse'], { queryParams: { caisseName } });
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  

}
