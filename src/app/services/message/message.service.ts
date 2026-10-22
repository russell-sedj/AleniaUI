import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MessageDto {
  id?: number;
  interimaireId: string;
  expediteur: string;
  sujet: string;
  contenu: string;
  categorie: 'mission' | 'administrative' | 'planning' | 'generale' | 'technique';
  important?: boolean;
  urgent?: boolean;
  dateEnvoi?: Date;
  lu?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Envoyer un message à un intérimaire
  envoyerMessage(message: MessageDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Message`, message);
  }

  // Récupérer tous les messages d'un intérimaire
  getMessagesInterimaire(interimaireId: string): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.apiUrl}/Message/interimaire/${interimaireId}`);
  }

  // Marquer un message comme lu
  marquerCommeLu(messageId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Message/${messageId}/marquer-lu`, {});
  }

  // Supprimer un message
  supprimerMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Message/${messageId}`);
  }

  // Méthodes utilitaires pour créer des messages automatiques
  creerMessageAcceptationCandidature(
    interimaireId: string, 
    nomInterimaire: string, 
    titreMission: string, 
    etablissement: string,
    dateMission: string,
    heureDebut: string,
    heureFin: string
  ): MessageDto {
    return {
      interimaireId,
      expediteur: `${etablissement} - Service Planning`,
      sujet: `✅ Candidature acceptée - ${titreMission}`,
      contenu: `Bonjour ${nomInterimaire},

Nous avons le plaisir de vous informer que votre candidature a été acceptée !

📋 **Détails de la mission :**
🏥 Établissement : ${etablissement}
📅 Date : ${dateMission}
⏰ Horaires : ${heureDebut} - ${heureFin}
💼 Mission : ${titreMission}

Votre mission a été automatiquement ajoutée à votre planning. Vous pouvez consulter tous les détails dans la section "Planning" de votre espace personnel.

Pour toute question, n'hésitez pas à nous contacter.

Félicitations et à bientôt !

L'équipe Alénia`,
      categorie: 'mission',
      important: true,
      urgent: false,
      lu: false,
      dateEnvoi: new Date()
    };
  }

  creerMessageRefusCandidature(
    interimaireId: string, 
    nomInterimaire: string, 
    titreMission: string, 
    etablissement: string
  ): MessageDto {
    return {
      interimaireId,
      expediteur: `${etablissement} - Service RH`,
      sujet: `❌ Candidature non retenue - ${titreMission}`,
      contenu: `Bonjour ${nomInterimaire},

Nous vous remercions pour l'intérêt que vous avez porté à notre mission "${titreMission}".

Après étude de votre candidature, nous avons le regret de vous informer que nous ne pourrons pas donner suite à votre demande pour cette mission spécifique.

Cette décision ne remet pas en question vos compétences professionnelles. Nous vous encourageons vivement à postuler pour d'autres missions qui correspondent à votre profil.

De nouvelles opportunités sont régulièrement disponibles sur notre plateforme.

Nous vous remercions de votre compréhension.

Cordialement,
L'équipe Alénia`,
      categorie: 'mission',
      important: false,
      urgent: false,
      lu: false,
      dateEnvoi: new Date()
    };
  }
}
