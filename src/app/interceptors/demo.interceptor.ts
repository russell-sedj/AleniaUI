import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Données fictives du build de démonstration alwaysdata.
 *
 * Le backend ASP.NET Core et MySQL ne sont pas hébergés sur l'offre gratuite.
 * Cet intercepteur ne s'active que lorsque deploy/demo-session.html a injecté
 * window.__ALENIA_DEMO__ = true. Il laisse passer toutes les requêtes dans
 * l'application réelle.
 */

interface DemoMission {
  id: string;
  etablissementId: string;
  etablissementNom: string;
  etablissementTelephone: string;
  poste: string;
  service: string;
  adresse: string;
  description: string;
  tauxHoraire: number;
  datePublication: string;
  nombreCandidatures: number;
  dateMission: string;
  heureDebut: string;
  heureFin: string;
  dureeHeures: number;
  estPlanifiee: boolean;
}

interface DemoCandidature {
  id: string;
  missionId: string;
  missionPoste: string;
  missionEtablissement: string;
  missionService: string;
  interimaireId: string;
  interimaireNom: string;
  interimairePrenom: string;
  interimaireSpecialite: string;
  interimaireExperience: number;
  interimaireTelephone: string;
  interimaireLocalisation: string;
  interimaireNote: number;
  interimaireTarif: number;
  statut: 'En cours' | 'Acceptée' | 'Refusée';
  dateCandidature: string;
  horairesChoisis: string[];
  missionDate?: string;
  message: string;
  tarifPropose: number;
}

function demoEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window as unknown as { __ALENIA_DEMO__?: boolean }).__ALENIA_DEMO__ === true
  );
}

function dateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const ETABLISSEMENT = {
  id: '22222222-2222-4222-8222-222222222222',
  email: 'contact@hopital-saint-antoine.fr',
  nom: 'Hôpital Saint-Antoine',
  responsable: 'Dr Claire Martin',
  adresse: '184 rue du Faubourg Saint-Antoine, 75012 Paris',
  telephone: '01 49 28 20 00',
  typeEtablissement: 'Hôpital public',
  numeroSiret: '123 456 789 00012',
  description:
    'Hôpital public de 800 lits, spécialisé dans les urgences, la cardiologie et la gériatrie.',
  services: [
    'Urgences',
    'Cardiologie',
    'Neurologie',
    'Chirurgie',
    'Pédiatrie',
    'Gériatrie',
  ],
};

const INTERIMAIRE = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'jean.dupont@alenia.fr',
  nom: 'Dupont',
  prenom: 'Jean',
  telephone: '06 12 34 56 78',
  specialite: 'Infirmier',
  adresse: '24 rue de la Roquette, 75011 Paris',
  dateCreation: '2024-01-15T10:00:00Z',
};

let missions: DemoMission[] = [
  {
    id: 'mission-1',
    etablissementId: ETABLISSEMENT.id,
    etablissementNom: ETABLISSEMENT.nom,
    etablissementTelephone: ETABLISSEMENT.telephone,
    poste: 'Infirmier en cardiologie',
    service: 'Cardiologie',
    adresse: 'Hôpital Saint-Antoine, 75012 Paris',
    description:
      "Surveillance des patients, préparation des soins et coordination avec l'équipe médicale.",
    tauxHoraire: 28,
    datePublication: dateOffset(-1),
    nombreCandidatures: 3,
    dateMission: dateOffset(1),
    heureDebut: '08:00',
    heureFin: '16:00',
    dureeHeures: 8,
    estPlanifiee: true,
  },
  {
    id: 'mission-2',
    etablissementId: ETABLISSEMENT.id,
    etablissementNom: ETABLISSEMENT.nom,
    etablissementTelephone: ETABLISSEMENT.telephone,
    poste: 'Aide-soignant en gériatrie',
    service: 'Gériatrie',
    adresse: 'Hôpital Saint-Antoine, 75012 Paris',
    description:
      'Accompagnement des patients âgés, aide aux soins quotidiens et suivi du dossier de soins.',
    tauxHoraire: 22,
    datePublication: dateOffset(-2),
    nombreCandidatures: 2,
    dateMission: dateOffset(2),
    heureDebut: '07:00',
    heureFin: '15:00',
    dureeHeures: 8,
    estPlanifiee: true,
  },
  {
    id: 'mission-3',
    etablissementId: ETABLISSEMENT.id,
    etablissementNom: ETABLISSEMENT.nom,
    etablissementTelephone: ETABLISSEMENT.telephone,
    poste: 'Infirmier aux urgences',
    service: 'Urgences',
    adresse: 'Hôpital Saint-Antoine, 75012 Paris',
    description:
      "Prise en charge des patients aux urgences, triage et soins d'urgence.",
    tauxHoraire: 32,
    datePublication: dateOffset(-3),
    nombreCandidatures: 4,
    dateMission: dateOffset(3),
    heureDebut: '14:00',
    heureFin: '22:00',
    dureeHeures: 8,
    estPlanifiee: true,
  },
  {
    id: 'mission-4',
    etablissementId: ETABLISSEMENT.id,
    etablissementNom: ETABLISSEMENT.nom,
    etablissementTelephone: ETABLISSEMENT.telephone,
    poste: 'Kinésithérapeute en rééducation',
    service: 'Rééducation',
    adresse: 'Hôpital Saint-Antoine, 75012 Paris',
    description:
      'Rééducation fonctionnelle des patients après chirurgie et accompagnement à la mobilité.',
    tauxHoraire: 35,
    datePublication: dateOffset(-4),
    nombreCandidatures: 1,
    dateMission: dateOffset(5),
    heureDebut: '09:00',
    heureFin: '17:00',
    dureeHeures: 8,
    estPlanifiee: true,
  },
  {
    id: 'mission-5',
    etablissementId: ETABLISSEMENT.id,
    etablissementNom: ETABLISSEMENT.nom,
    etablissementTelephone: ETABLISSEMENT.telephone,
    poste: 'Médecin de garde',
    service: 'Urgences',
    adresse: 'Hôpital Saint-Antoine, 75012 Paris',
    description:
      'Garde médicale de nuit aux urgences, coordination des admissions et des soins.',
    tauxHoraire: 45,
    datePublication: dateOffset(-5),
    nombreCandidatures: 2,
    dateMission: dateOffset(7),
    heureDebut: '20:00',
    heureFin: '08:00',
    dureeHeures: 12,
    estPlanifiee: true,
  },
];

let candidaturesByMission: Record<string, DemoCandidature[]> = {
  'mission-1': [
    {
      id: 'candidature-1',
      missionId: 'mission-1',
      missionPoste: 'Infirmier en cardiologie',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Cardiologie',
      interimaireId: '3',
      interimaireNom: 'Martin',
      interimairePrenom: 'Sophie',
      interimaireSpecialite: 'Infirmière',
      interimaireExperience: 5,
      interimaireTelephone: '06 12 34 56 78',
      interimaireLocalisation: 'Paris 12e',
      interimaireNote: 4.8,
      interimaireTarif: 28,
      statut: 'En cours',
      dateCandidature: dateOffset(-1),
      horairesChoisis: ['08:00-16:00'],
      message: 'Disponible immédiatement pour cette mission.',
      tarifPropose: 28,
    },
    {
      id: 'candidature-2',
      missionId: 'mission-1',
      missionPoste: 'Infirmier en cardiologie',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Cardiologie',
      interimaireId: '4',
      interimaireNom: 'Benali',
      interimairePrenom: 'Karim',
      interimaireSpecialite: 'Infirmier',
      interimaireExperience: 7,
      interimaireTelephone: '06 45 78 12 34',
      interimaireLocalisation: 'Paris 11e',
      interimaireNote: 4.7,
      interimaireTarif: 27,
      statut: 'Acceptée',
      dateCandidature: dateOffset(-2),
      horairesChoisis: ['08:00-16:00'],
      message: '',
      tarifPropose: 27,
    },
    {
      id: 'candidature-3',
      missionId: 'mission-1',
      missionPoste: 'Infirmier en cardiologie',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Cardiologie',
      interimaireId: INTERIMAIRE.id,
      interimaireNom: INTERIMAIRE.nom,
      interimairePrenom: INTERIMAIRE.prenom,
      interimaireSpecialite: INTERIMAIRE.specialite,
      interimaireExperience: 6,
      interimaireTelephone: INTERIMAIRE.telephone,
      interimaireLocalisation: 'Paris 11e',
      interimaireNote: 4.9,
      interimaireTarif: 28,
      statut: 'Acceptée',
      dateCandidature: dateOffset(-1),
      horairesChoisis: ['08:00-16:00'],
      message: '',
      tarifPropose: 28,
    },
  ],
  'mission-2': [
    {
      id: 'candidature-4',
      missionId: 'mission-2',
      missionPoste: 'Aide-soignant en gériatrie',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Gériatrie',
      interimaireId: '5',
      interimaireNom: 'Leroy',
      interimairePrenom: 'Julie',
      interimaireSpecialite: 'Aide-soignante',
      interimaireExperience: 3,
      interimaireTelephone: '06 78 90 12 34',
      interimaireLocalisation: 'Paris 12e',
      interimaireNote: 4.6,
      interimaireTarif: 22,
      statut: 'En cours',
      dateCandidature: dateOffset(-1),
      horairesChoisis: ['07:00-15:00'],
      message: 'Je travaille dans le service depuis deux ans.',
      tarifPropose: 22,
    },
    {
      id: 'candidature-5',
      missionId: 'mission-2',
      missionPoste: 'Aide-soignant en gériatrie',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Gériatrie',
      interimaireId: INTERIMAIRE.id,
      interimaireNom: INTERIMAIRE.nom,
      interimairePrenom: INTERIMAIRE.prenom,
      interimaireSpecialite: INTERIMAIRE.specialite,
      interimaireExperience: 6,
      interimaireTelephone: INTERIMAIRE.telephone,
      interimaireLocalisation: 'Paris 11e',
      interimaireNote: 4.9,
      interimaireTarif: 22,
      statut: 'Acceptée',
      dateCandidature: dateOffset(-2),
      horairesChoisis: ['07:00-15:00'],
      message: '',
      tarifPropose: 22,
    },
  ],
  'mission-3': [
    {
      id: 'candidature-6',
      missionId: 'mission-3',
      missionPoste: 'Infirmier aux urgences',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Urgences',
      interimaireId: '6',
      interimaireNom: 'Petit',
      interimairePrenom: 'Thomas',
      interimaireSpecialite: 'Infirmier',
      interimaireExperience: 4,
      interimaireTelephone: '06 23 45 67 89',
      interimaireLocalisation: 'Paris 20e',
      interimaireNote: 4.5,
      interimaireTarif: 32,
      statut: 'En cours',
      dateCandidature: dateOffset(-1),
      horairesChoisis: ['14:00-22:00'],
      message: 'Habitué aux urgences et aux gardes.',
      tarifPropose: 32,
    },
    {
      id: 'candidature-7',
      missionId: 'mission-3',
      missionPoste: 'Infirmier aux urgences',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Urgences',
      interimaireId: '7',
      interimaireNom: 'Diallo',
      interimairePrenom: 'Nadia',
      interimaireSpecialite: 'Infirmière',
      interimaireExperience: 8,
      interimaireTelephone: '06 34 56 78 90',
      interimaireLocalisation: 'Paris 13e',
      interimaireNote: 4.7,
      interimaireTarif: 34,
      statut: 'Refusée',
      dateCandidature: dateOffset(-3),
      horairesChoisis: ['14:00-22:00'],
      message: '',
      tarifPropose: 34,
    },
  ],
  'mission-4': [
    {
      id: 'candidature-8',
      missionId: 'mission-4',
      missionPoste: 'Kinésithérapeute en rééducation',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Rééducation',
      interimaireId: '8',
      interimaireNom: 'Moreau',
      interimairePrenom: 'Lucas',
      interimaireSpecialite: 'Kinésithérapeute',
      interimaireExperience: 6,
      interimaireTelephone: '06 56 78 90 12',
      interimaireLocalisation: 'Paris 14e',
      interimaireNote: 4.8,
      interimaireTarif: 35,
      statut: 'En cours',
      dateCandidature: dateOffset(-2),
      horairesChoisis: ['09:00-17:00'],
      message: 'Spécialisé en rééducation post-opératoire.',
      tarifPropose: 35,
    },
  ],
  'mission-5': [
    {
      id: 'candidature-9',
      missionId: 'mission-5',
      missionPoste: 'Médecin de garde',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Urgences',
      interimaireId: '9',
      interimaireNom: 'Rousseau',
      interimairePrenom: 'Emma',
      interimaireSpecialite: 'Médecin généraliste',
      interimaireExperience: 9,
      interimaireTelephone: '06 67 89 01 23',
      interimaireLocalisation: 'Paris 12e',
      interimaireNote: 4.9,
      interimaireTarif: 48,
      statut: 'En cours',
      dateCandidature: dateOffset(-1),
      horairesChoisis: ['20:00-08:00'],
      message: 'Disponible pour les gardes de nuit.',
      tarifPropose: 45,
    },
    {
      id: 'candidature-10',
      missionId: 'mission-5',
      missionPoste: 'Médecin de garde',
      missionEtablissement: ETABLISSEMENT.nom,
      missionService: 'Urgences',
      interimaireId: '10',
      interimaireNom: 'El Amrani',
      interimairePrenom: 'Yassine',
      interimaireSpecialite: 'Médecin urgentiste',
      interimaireExperience: 11,
      interimaireTelephone: '06 78 90 12 34',
      interimaireLocalisation: 'Paris 15e',
      interimaireNote: 4.8,
      interimaireTarif: 50,
      statut: 'Acceptée',
      dateCandidature: dateOffset(-3),
      horairesChoisis: ['20:00-08:00'],
      message: '',
      tarifPropose: 50,
    },
  ],
};

const DEMO_MESSAGES = [
  {
    id: 1,
    interimaireId: INTERIMAIRE.id,
    expediteur: 'Hôpital Saint-Antoine - Service Planning',
    sujet: 'Mission confirmée en cardiologie',
    contenu:
      'Bonjour Jean, votre candidature pour la mission en cardiologie a été acceptée. Vous pouvez consulter les détails dans votre planning.',
    categorie: 'mission',
    important: true,
    urgent: false,
    dateEnvoi: dateOffset(-1),
    lu: false,
  },
  {
    id: 2,
    interimaireId: INTERIMAIRE.id,
    expediteur: 'Équipe Alenia',
    sujet: 'Bienvenue dans votre espace de démonstration',
    contenu:
      'Les données affichées sont fictives. Vous pouvez naviguer librement dans les tableaux de bord et tester les parcours proposés.',
    categorie: 'generale',
    important: false,
    urgent: false,
    dateEnvoi: dateOffset(-2),
    lu: true,
  },
];

let nextMissionId = 6;
let nextCandidatureId = 11;

function allCandidatures(): DemoCandidature[] {
  return Object.values(candidaturesByMission).flat();
}

function respond<T>(body: T): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status: 200, body }));
}

function normalizePath(url: string): string {
  return url.split('?')[0].replace(/^https?:\/\/[^/]+/i, '');
}

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!demoEnabled()) {
    return next(req);
  }

  const path = normalizePath(req.url);
  const method = req.method.toUpperCase();

  if (method === 'GET') {
    if (path === '/api/etablissement/current') {
      return respond(ETABLISSEMENT);
    }

    if (path === '/api/interimaire/current') {
      return respond(INTERIMAIRE);
    }

    if (
      path === '/api/missions' ||
      path === '/api/missions/search' ||
      path.startsWith('/api/missions/etablissement/')
    ) {
      return respond(missions);
    }

    if (path === '/api/candidatures/exists') {
      return respond({ exists: false });
    }

    if (path.startsWith('/api/candidatures/mission/')) {
      const missionId = path.split('/').pop() ?? '';
      const mission = missions.find((item) => item.id === missionId);
      const liste = (candidaturesByMission[missionId] ?? []).map(
        (candidature) => ({
          ...candidature,
          missionDate: mission?.dateMission,
        })
      );
      return respond(liste);
    }

    if (path.startsWith('/api/candidatures/interimaire/')) {
      const interimaireId = path.split('/').pop() ?? '';
      const liste = allCandidatures()
        .filter((candidature) => candidature.interimaireId === interimaireId)
        .map((candidature) => {
          const mission = missions.find(
            (item) => item.id === candidature.missionId
          );
          return { ...candidature, missionDate: mission?.dateMission };
        });
      return respond(liste);
    }

    if (path.startsWith('/api/Message/interimaire/')) {
      return respond(DEMO_MESSAGES);
    }

    const missionMatch = path.match(/^\/api\/missions\/([^/]+)$/);
    if (missionMatch) {
      const mission = missions.find((item) => item.id === missionMatch[1]);
      return respond(mission ?? null);
    }
  }

  if (method === 'PUT' && path === '/api/etablissement/update') {
    Object.assign(ETABLISSEMENT, req.body ?? {});
    return respond(ETABLISSEMENT);
  }

  if (method === 'POST' && path === '/api/missions') {
    const body = (req.body ?? {}) as Partial<DemoMission>;
    const mission: DemoMission = {
      id: `mission-${nextMissionId++}`,
      etablissementId: body.etablissementId ?? ETABLISSEMENT.id,
      etablissementNom: ETABLISSEMENT.nom,
      etablissementTelephone: ETABLISSEMENT.telephone,
      poste: body.poste ?? 'Nouvelle mission',
      service: body.service ?? 'Soins',
      adresse: body.adresse ?? ETABLISSEMENT.adresse,
      description: body.description ?? '',
      tauxHoraire: Number(body.tauxHoraire ?? 25),
      datePublication: new Date().toISOString(),
      nombreCandidatures: 0,
      dateMission: body.dateMission
        ? new Date(body.dateMission).toISOString()
        : dateOffset(7),
      heureDebut: body.heureDebut ?? '08:00',
      heureFin: body.heureFin ?? '16:00',
      dureeHeures: Number(body.dureeHeures ?? 8),
      estPlanifiee: false,
    };

    missions = [mission, ...missions];
    return respond(mission);
  }

  const missionMatch = path.match(/^\/api\/missions\/([^/]+)$/);
  if (missionMatch && method === 'PUT') {
    const index = missions.findIndex((item) => item.id === missionMatch[1]);
    if (index >= 0) {
      missions[index] = {
        ...missions[index],
        ...(req.body as Partial<DemoMission>),
      };
      return respond(missions[index]);
    }
  }

  if (missionMatch && method === 'DELETE') {
    missions = missions.filter((item) => item.id !== missionMatch[1]);
    delete candidaturesByMission[missionMatch[1]];
    return respond({ message: 'Mission supprimée' });
  }

  const candidatureStatutMatch = path.match(
    /^\/api\/candidatures\/([^/]+)\/statut$/
  );
  if (candidatureStatutMatch && method === 'PUT') {
    const statut = (req.body as { statut?: string } | null)?.statut;
    for (const liste of Object.values(candidaturesByMission)) {
      const candidature = liste.find(
        (item) => item.id === candidatureStatutMatch[1]
      );
      if (candidature) {
        candidature.statut = (
          statut === 'Acceptée' || statut === 'Refusée' ? statut : 'En cours'
        ) as DemoCandidature['statut'];
        return respond(candidature);
      }
    }
  }

  if (method === 'POST' && path === '/api/candidatures') {
    const body = (req.body ?? {}) as {
      missionId?: string;
      interimaireId?: string;
      horairesChoisis?: string[];
    };
    const mission = missions.find((item) => item.id === body.missionId);
    if (mission) {
      const candidature: DemoCandidature = {
        id: `candidature-${nextCandidatureId++}`,
        missionId: mission.id,
        missionPoste: mission.poste,
        missionEtablissement: ETABLISSEMENT.nom,
        missionService: mission.service,
        interimaireId: body.interimaireId ?? INTERIMAIRE.id,
        interimaireNom: INTERIMAIRE.nom,
        interimairePrenom: INTERIMAIRE.prenom,
        interimaireSpecialite: INTERIMAIRE.specialite,
        interimaireExperience: 6,
        interimaireTelephone: INTERIMAIRE.telephone,
        interimaireLocalisation: 'Paris 11e',
        interimaireNote: 4.9,
        interimaireTarif: mission.tauxHoraire,
        statut: 'En cours',
        dateCandidature: new Date().toISOString(),
        horairesChoisis: body.horairesChoisis ?? [],
        missionDate: mission.dateMission,
        message: '',
        tarifPropose: mission.tauxHoraire,
      };
      candidaturesByMission[mission.id] = [
        ...(candidaturesByMission[mission.id] ?? []),
        candidature,
      ];
      mission.nombreCandidatures += 1;
      return respond(candidature);
    }
  }

  const candidatureMatch = path.match(/^\/api\/candidatures\/([^/]+)$/);
  if (candidatureMatch && method === 'DELETE') {
    for (const missionId of Object.keys(candidaturesByMission)) {
      candidaturesByMission[missionId] = candidaturesByMission[
        missionId
      ].filter((item) => item.id !== candidatureMatch[1]);
    }
    return respond({ message: 'Candidature supprimée' });
  }

  if (method === 'POST' && path === '/api/Message') {
    return respond({ id: Date.now(), ...(req.body as object) });
  }

  if (method === 'PUT' && /^\/api\/Message\/[^/]+\/marquer-lu$/.test(path)) {
    return respond({ message: 'Message marqué comme lu' });
  }

  if (method === 'DELETE' && /^\/api\/Message\/[^/]+$/.test(path)) {
    return respond({ message: 'Message supprimé' });
  }

  return next(req);
};
