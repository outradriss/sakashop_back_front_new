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
  editMode = false;
editingCaisseId: number | null = null;

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
      utilisateur: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')
        ]
      ],
      
      role: [{ value: 'CAISSIER', disabled: true }]
    });
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['selectedProducts']) {
      this.cachedProducts = navigation.extras.state['selectedProducts'];
      this.isAddCaissePopupVisible = true; // Réouvrir le popup
    }
  }

  ngOnInit(): void {
    this.loadCaisses(); 
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
          this.closeAddCaissePopup(); 
          this.loadCaisses(); 
          this.isSubmitting = false; 
        },
        (error: any) => {
          console.error("Erreur lors de l'ajout de la caisse :", error);
          this.isSubmitting = false; // Réactiver le bouton en cas d'erreur
        }
      );
    }
  }
  

  editCaisse(caisse: any): void {
    this.editMode = true;
    this.editingCaisseId = caisse.id;
    this.isAddCaissePopupVisible = true;
    this.addCaisseForm.patchValue({
      nom: caisse.nom,
      pays: caisse.pays,
      ville: caisse.ville,
      utilisateur: caisse.utilisateur.split('@')[0], // retirer le domaine
      password: '', // mot de passe non modifiable ici
      role: 'CAISSIER'
    });
  }
  
  deleteCaisse(caisse: any): void {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette caisse ?")) return;
  
    this.addCaisseService.deleteCaisse(caisse.id).subscribe(
      (res: any) => {
        if (res?.status === 'warning') {
          alert(res.message);
        } else {
          alert("✅ Caisse supprimée avec succès");
          this.loadCaisses();
        }
      },
      (error) => {
        console.error("Erreur côté serveur :", error);
        alert("Erreur lors de la suppression !");
      }
    );
  }
  


  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }


  
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  resetForm(): void {
    this.closeAddCaissePopup();
    this.editMode = false;
    this.editingCaisseId = null;
    this.isSubmitting = false;
  }

}
