import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { CaisseComponent } from './caisse/caisse.component';
import { CreditClientsComponent } from './credit-clients/credit-clients.component';
import { GestionVenteComponent } from './gestion-vente/gestion-vente.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CaisseComponent,
    CreditClientsComponent,
    GestionVenteComponent,
    GestionProduitsComponent,
   HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ar-MA' } // Définit la locale marocaine
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
