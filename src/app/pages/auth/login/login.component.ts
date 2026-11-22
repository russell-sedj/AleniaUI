import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginDto } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { DemoAccessComponent } from '../../../components/demo-access/demo-access.component';
import { DemoSessionService } from '../../../services/demo/demo-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, DemoAccessComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string = '';
  model: LoginDto = {
    email: '',
    motDePasse: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private demo: DemoSessionService
  ) {}

  onSubmit(form: any) {
    if (this.demo.enabled) {
      this.demo.enter('interimaire');
      return;
    }

    if (form.valid) {
      console.log('Tentative de connexion avec:', this.model);      this.authService.login(this.model).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          this.router.navigate(['/dashboard-interimaire']);
        },
        error: (error) => {
          console.error('Erreur détaillée:', error);
          this.errorMessage = error.error.message || 'Erreur de connexion';
        },
      });
    }
  }
}
