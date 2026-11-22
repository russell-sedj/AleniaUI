import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoSessionService } from '../../services/demo/demo-session.service';

@Component({
  selector: 'app-demo-access',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="demo.enabled" class="mt-6 border-t border-gray-200 pt-5">
      <p class="text-sm font-semibold text-gray-700">Démo : accès direct</p>
      <p class="mt-1 text-xs text-gray-500">
        Choisissez un profil pour tester l'application. Aucun compte à créer,
        les données sont fictives.
      </p>

      <div class="mt-3 space-y-2">
        <button
          type="button"
          (click)="demo.enter('interimaire')"
          class="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>
            <strong>Intérimaire</strong><br />
            <span class="text-xs text-gray-500">
              Profil, missions et candidatures
            </span>
          </span>
          <span aria-hidden="true">&rarr;</span>
        </button>

        <button
          type="button"
          (click)="demo.enter('etablissement')"
          class="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>
            <strong>Établissement</strong><br />
            <span class="text-xs text-gray-500">
              Missions, candidatures et planning
            </span>
          </span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <p class="mt-3 text-xs text-gray-500">
        Données de démonstration, aucune inscription réelle.
      </p>
    </div>
  `
})
export class DemoAccessComponent {
  constructor(public demo: DemoSessionService) {}
}
