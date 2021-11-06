/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunicationService } from '@app/services/communication.service';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;
    const newPlayedWords: Map<string, string[]> = new Map<string, string[]>([['ma', ['H8', 'H9']]]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, HttpClientModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should handle http error safely', () => {
        service.validationPost(newPlayedWords).subscribe((response: boolean) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${baseUrl}/multiplayer/validateWords`);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('Random error occurred'));
    });

    it('should return the result of a validation request', () => {
        service.validationPost(newPlayedWords).subscribe(() => {}, fail);
        expect(service['wordsToValidate']).toEqual(['ma']);
        const req = httpMock.expectOne(`${baseUrl}/multiplayer/validateWords`);
        expect(req.request.method).toBe('POST');
        req.flush(newPlayedWords);
    });
});
