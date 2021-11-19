import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AiPlayer, AiPlayerDB } from '@common/ai-name';
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

    getAiBeginners(): Observable<AiPlayerDB[]> {
        return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners`).pipe(catchError(this.handleError<AiPlayerDB[]>('getAiBeginners')));
    }

    getAiExperts(): Observable<AiPlayerDB[]> {
        return this.http.get<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts`).pipe(catchError(this.handleError<AiPlayerDB[]>('getAiExperts')));
    }

    addAiBeginner(aiBeginner: AiPlayer): Observable<AiPlayerDB> {
        return this.http
            .post<AiPlayerDB>(`${this.baseUrl}/admin/aiBeginners`, aiBeginner)
            .pipe(catchError(this.handleError<AiPlayerDB>('postAiBeginners')));
    }

    addAiExpert(aiExpert: AiPlayer): Observable<AiPlayerDB> {
        return this.http
            .post<AiPlayerDB>(`${this.baseUrl}/admin/aiExperts`, aiExpert)
            .pipe(catchError(this.handleError<AiPlayerDB>('postAiExperts')));
    }

    deleteAiBeginner(id: string): Observable<AiPlayerDB[]> {
        return this.http
            .delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners/${id}`)
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiBeginner')));
    }

    deleteAiExpert(id: string): Observable<AiPlayerDB[]> {
        return this.http
            .delete<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts/${id}`)
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiExpert')));
    }

    updateAiBeginner(id: string, aiName: string): Observable<AiPlayerDB[]> {
        return this.http
            .put<AiPlayerDB[]>(`${this.baseUrl}/admin/aiBeginners/${id}`, aiName)
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiBeginner')));
    }

    updateAiExpert(id: string, aiName: string): Observable<AiPlayerDB[]> {
        return this.http
            .put<AiPlayerDB[]>(`${this.baseUrl}/admin/aiExperts/${id}`, aiName)
            .pipe(catchError(this.handleError<AiPlayerDB[]>('deleteAiExpert')));
    }

    // TODO paramètre non utilise
    uploadFile(file: File): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<string>(`${this.baseUrl}/multiplayer/uploadDictionary`, formData);
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
