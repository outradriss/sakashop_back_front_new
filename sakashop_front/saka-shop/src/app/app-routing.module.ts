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
import { HistoryComponent } from './history/history.component';
import { TurnoverComponent } from './turnover/turnover.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { GestionCaisseComponent } from './gestion-caisse/gestion-caisse.component';
import { StockCaisseComponent } from './stock-caisse/stock-caisse.component';
import { LockGuard } from './guards/lock.guard';
import { FlushCaisseComponent } from './flush-caisse/flush-caisse.component';
import { OpenCaisseComponent } from './open-caisse/open-caisse.component';
import { FacturesComponent } from './factures/factures.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard,LockGuard] },
  { path: 'caisse/list', component: CaisseComponent ,canActivate: [] },
  { path: 'credit-client', component: CreditClientsComponent ,canActivate: [AuthGuard,LockGuard] },
  { path: 'gestion-vente', component: GestionVenteComponent ,canActivate: [AuthGuard,LockGuard] },
  { path: 'gestion-product/list', component: GestionProduitsComponent ,canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent ,canActivate: [AuthGuard] },
  { path: 'consumer', component: ConsumerComponent ,canActivate: [AuthGuard] },
  { path: 'turnover', component: TurnoverComponent ,canActivate: [AuthGuard] },
  { path: 'gestion-caisse', component: GestionCaisseComponent ,canActivate: [AuthGuard] },
  { path: 'stock-caisse', component: StockCaisseComponent ,canActivate: [AuthGuard] },
  { path: 'flush-caisse', component: FlushCaisseComponent ,canActivate: [AuthGuard] },
  { path: 'open-caisse', component: OpenCaisseComponent ,canActivate: [AuthGuard] },
  { path: 'gestion-facture', component: FacturesComponent ,canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
