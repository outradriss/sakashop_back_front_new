import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';



@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  loginForm: FormGroup | any;
  errorMessage: string | null = null;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
  
    const loginData = this.loginForm.value;
  
    this.authService.login(loginData).subscribe(
      (response: any) => {
        this.isLoading = false;
  
        // Sauvegarder le token
        const token = response.token;
        localStorage.setItem('token', token);
  
        // Décoder le token pour récupérer les rôles
        const decodedToken: any = jwtDecode(token);
        const roles: string[] = decodedToken.roles || [];
  
        // Vérifier les rôles pour gérer les accès
        if (roles.includes('ROLE_CAISSIER')) {
          // Rediriger directement vers "open-caisse"
          this.router.navigate(['/open-caisse']);
        } else if (roles.includes('ROLE_ADMIN')) {
          // Admin : Accès à tout sauf "caisse/list"
          this.router.navigate(['home']);
        } else {
          // Aucun rôle autorisé
          this.errorMessage = "Vous n'avez pas les autorisations nécessaires.";
          localStorage.removeItem('token'); // Supprime le token si non autorisé
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password';
      }
    );
  }
  
  
}
