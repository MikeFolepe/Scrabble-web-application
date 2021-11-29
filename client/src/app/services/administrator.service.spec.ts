/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministratorService } from './administrator.service';
describe('AdministratorService', () => {
    let service: AdministratorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        });
        service = TestBed.inject(AdministratorService);

        service.beginnerNames = [
            {
                _id: '1',
                aiName: 'Mister_Bucky',
                isDefault: true,
            },
            {
                _id: '2',
                aiName: 'Miss_Betty',
                isDefault: true,
            },
            {
                _id: '3',
                aiName: 'Mister_Samy',
                isDefault: true,
            },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a random name of begginer Ai name', () => {
        service.getAiBeginnerName();
        expect(service.getAiBeginnerName()).not.toEqual('');
    });
});
