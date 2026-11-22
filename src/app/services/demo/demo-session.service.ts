import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type DemoRole = 'interimaire' | 'etablissement';

declare global {
  interface Window {
    __ALENIA_DEMO__?: boolean;
  }
}

const DEMO_USERS: Record<DemoRole, Record<string, string>> = {
  interimaire: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'jean.dupont@alenia.fr',
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: '06 12 34 56 78',
    specialite: 'Infirmier',
    dateCreation: '2024-01-15T10:00:00Z'
  },
  etablissement: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'contact@hopital-saint-antoine.fr',
    nom: 'Hopital Saint-Antoine',
    adresse: '184 rue du Faubourg Saint-Antoine, 75012 Paris',
    telephone: '01 49 28 20 00',
    typeEtablissement: 'Hopital public',
    dateCreation: '2024-01-15T10:00:00Z'
  }
};

/**
 * Client-side demo sessions for the static alwaysdata deployment.
 * Disabled unless the demo build injects window.__ALENIA_DEMO__ = true.
 */
@Injectable({
  providedIn: 'root'
})
export class DemoSessionService {
  readonly enabled =
    typeof window !== 'undefined' && window.__ALENIA_DEMO__ === true;

  constructor(private router: Router) {}

  enter(role: DemoRole): void {
    if (!this.enabled || typeof window === 'undefined') {
      return;
    }

    const user = DEMO_USERS[role];
    const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
    const payload = btoa(JSON.stringify({ exp, role, UserId: user['id'] }));

    localStorage.setItem(`authToken_${role}`, `demo.${payload}.demo`);
    localStorage.setItem(`currentUser_${role}`, JSON.stringify(user));
    localStorage.setItem(`userType_${role}`, role);

    this.router.navigate([
      role === 'etablissement'
        ? '/dashboard-etablissement'
        : '/dashboard-interimaire'
    ]);
  }
}
