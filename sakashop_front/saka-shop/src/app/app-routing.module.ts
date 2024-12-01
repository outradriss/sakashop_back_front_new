import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CaisseComponent } from './caisse/caisse.component';
import { CreditClientsComponent } from './credit-clients/credit-clients.component';
import { GestionVenteComponent } from './gestion-vente/gestion-vente.component';
import { AuthGuard } from './auth.guard';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard]  },
  { path: 'caisse/list', component: CaisseComponent ,canActivate: [AuthGuard] },
  { path: 'credit-client', component: CreditClientsComponent ,canActivate: [AuthGuard] },
  { path: 'meilleur-vente', component: GestionVenteComponent ,canActivate: [AuthGuard] },
  { path: 'gestion-product/list', component: GestionProduitsComponent ,canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
