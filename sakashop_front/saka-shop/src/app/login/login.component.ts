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
  
        const token = response.token;
        localStorage.setItem('token', token);
  
        const decodedToken: any = jwtDecode(token);
        const roles: string[] = decodedToken.roles || [];
        console.log(decodedToken);

  
        if (roles.includes('ROLE_CAISSIER')) {
          // ➕ Appeler le backend pour récupérer la caisse
          this.authService.getMyCaisse().subscribe(
            (caisseResponse: any) => {
              localStorage.setItem('caisse', JSON.stringify(caisseResponse));
              this.router.navigate(['/open-caisse']);
            },
            (error) => {
              this.errorMessage = "Caisse non trouvée pour cet utilisateur.";
              localStorage.removeItem('token');
            }
          );
        } else if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['home']);
        } else {
          this.errorMessage = "Vous n'avez pas les autorisations nécessaires.";
          localStorage.removeItem('token');
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Email ou mot de passe invalide';
      }
    );
  }
  
  
  
}
