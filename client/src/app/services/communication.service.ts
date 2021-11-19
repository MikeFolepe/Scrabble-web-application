import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerScore } from '@common/player';
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

    addPlayers(player: PlayerScore[]): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/multiplayer/best-scores`, player).pipe(catchError(this.handleError<void>('addPlayers')));
    }

    getBestPlayers(): Observable<PlayerScore[]> {
        return this.http
            .get<PlayerScore[]>(`${this.baseUrl}/multiplayer/best-scores`)
            .pipe(catchError(this.handleError<PlayerScore[]>('getbestPlayers')));
    }

    uploadFile(file: File): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<string>(`${this.baseUrl}/multiplayer/uploadDictionary`, formData);
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
