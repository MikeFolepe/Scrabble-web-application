import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AiPlayer, AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
        return this.http
            .post<boolean>(`${this.baseUrl}/multiplayer/validateWords`, this.wordsToValidate)
            .pipe(catchError(this.handleError<boolean>('validationPost')));
    }

    getGameDictionary(fileName: string): Observable<string[]> {
        return this.http
            .get<string[]>(`${this.baseUrl}/multiplayer/dictionary/${fileName}`)
            .pipe(catchError(this.handleError<string[]>('getGameDictionary')));
    }

    getAiPlayers(aiType: AiType): Observable<AiPlayerDB[]> {
        if (aiType) {
            return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts`).pipe(catchError(this.handleError<AiPlayerDB[]>('getAiPlayers')));
        }
        return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners`).pipe(catchError(this.handleError<AiPlayerDB[]>('getAiPlayers')));
    }

    addAiPlayer(aiPlayer: AiPlayer, aiType: AiType): Observable<AiPlayerDB> {
        return this.http
            .post<AiPlayerDB>(`${this.baseUrl}/admin/aiPlayers`, { aiPlayer, aiType })
            .pipe(catchError(this.handleError<AiPlayerDB>('postAiBeginners')));
    }

    deleteAiPlayer(id: string, aiType: AiType): Observable<AiPlayerDB[]> {
        if (aiType) {
            return this.http
                .delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts/${id}`)
                .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiExpert')));
        }
        return this.http
            .delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners/${id}`)
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiBeginner')));
    }

    updateAiPlayer(id: string, aiBeginner: AiPlayer, aiType: AiType): Observable<AiPlayerDB[]> {
        return this.http
            .put<AiPlayerDB[]>(`${this.baseUrl}/admin/aiPlayers/${id}`, { aiBeginner, aiType })
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiBeginner')));
    }

    uploadFile(file: File): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<string>(`${this.baseUrl}/admin/uploadDictionary`, formData);
    }

    getDictionaries(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/admin/dictionaries`).pipe(catchError(this.handleError<Dictionary[]>('deleteAiBeginner')));
    }

    upDateDictionary(dictionary: Dictionary): Observable<Dictionary[]> {
        return this.http
            .put<Dictionary[]>(`${this.baseUrl}/admin/dictionaries`, dictionary)
            .pipe(catchError(this.handleError<Dictionary[]>('upDateDictionary')));
    }

    deleteDictionary(fileName: string): Observable<Dictionary[]> {
        return this.http
            .delete<Dictionary[]>(`${this.baseUrl}/admin/dictionaries/${fileName}`)
            .pipe(catchError(this.handleError<Dictionary[]>('deleteDictionary')));
    }

    downloadDictionary(fileName: string): Observable<void> {
        return this.http.get<void>(`${this.baseUrl}/admin/download/${fileName}`).pipe(catchError(this.handleError<void>('downloadDictionary')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
