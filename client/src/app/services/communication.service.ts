import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AiPlayer, AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string;
    private wordsToValidate: string[];

    constructor(private readonly http: HttpClient) {
        this.baseUrl = environment.serverUrl + '/api';
        this.wordsToValidate = [];
    }

    validationPost(newPlayedWords: Map<string, string[]>): Observable<boolean> {
        this.wordsToValidate = [];
        for (const word of newPlayedWords.keys()) {
            this.wordsToValidate.push(word);
        }
        return this.http.post<boolean>(`${this.baseUrl}/multiplayer/validateWords`, this.wordsToValidate);
    }

    getGameDictionary(fileName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/multiplayer/dictionary/${fileName}`);
    }

    getAiPlayers(aiType: AiType): Observable<AiPlayerDB[]> {
        if (aiType === AiType.expert) {
            return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts`);
        }
        return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners`);
    }

    addAiPlayer(aiPlayer: AiPlayer, aiType: AiType): Observable<AiPlayerDB> {
        return this.http.post<AiPlayerDB>(`${this.baseUrl}/admin/aiPlayers`, { aiPlayer, aiType });
    }

    deleteAiPlayer(id: string, aiType: AiType): Observable<AiPlayerDB[]> {
        if (aiType === AiType.expert) {
            return this.http.delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts/${id}`);
        }
        return this.http.delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners/${id}`);
    }

    updateAiPlayer(id: string, aiBeginner: AiPlayer, aiType: AiType): Observable<AiPlayerDB[]> {
        return this.http.put<AiPlayerDB[]>(`${this.baseUrl}/admin/aiPlayers/${id}`, { aiBeginner, aiType });
    }

    uploadFile(file: File): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<string>(`${this.baseUrl}/admin/uploadDictionary`, formData);
    }

    getDictionaries(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/admin/dictionaries`);
    }

    updateDictionary(dictionary: Dictionary): Observable<Dictionary[]> {
        return this.http.put<Dictionary[]>(`${this.baseUrl}/admin/dictionaries`, dictionary);
    }

    deleteDictionary(fileName: string): Observable<Dictionary[]> {
        return this.http.delete<Dictionary[]>(`${this.baseUrl}/admin/dictionaries/${fileName}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    downloadDictionary(fileName: string): Observable<any> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.http.get<any>(`${this.baseUrl}/admin/download/${fileName}`);
    }

    // private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    //     return () => of(result as T);
    // }
}
