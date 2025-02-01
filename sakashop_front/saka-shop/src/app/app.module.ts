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
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { HistoryComponent } from './history/history.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { TurnoverComponent } from './turnover/turnover.component';
import { VenteComponent } from './vente/vente.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { ConsumerComponent } from './consumer/consumer.component';
import { ToastrModule } from 'ngx-toastr';
import { GestionCaisseComponent } from './gestion-caisse/gestion-caisse.component';
import { StockCaisseComponent } from './stock-caisse/stock-caisse.component';
import { FlushCaisseComponent } from './flush-caisse/flush-caisse.component';
import { OpenCaisseComponent } from './open-caisse/open-caisse.component';
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
   HistoryComponent,
   TurnoverComponent,
   VenteComponent,
   ConsumerComponent,
   GestionCaisseComponent,
   StockCaisseComponent,
   FlushCaisseComponent,
   OpenCaisseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // Position centrale haute
      preventDuplicates: true,          // Empêche les doublons
      closeButton: true,                 // Ajoute un bouton de fermeture
      progressBar: true,                 // Barre de progression
      timeOut: 5000,                     // Durée en millisecondes
    }),    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
