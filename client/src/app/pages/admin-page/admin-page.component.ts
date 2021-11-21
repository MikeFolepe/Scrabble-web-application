import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AdministratorService } from '@app/services/administrator.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('fileInput') fileInput: ElementRef;
    isResetConfirmation: boolean;

    constructor(public adminService: AdministratorService) {
        this.isResetConfirmation = false;
    }

    ngOnInit() {
        this.adminService.initializeAiPlayers();
        this.adminService.initializeDictionaries();
    }

    onSubmitDictionary(): void {
        this.adminService.onSubmit();
        this.fileInput.nativeElement.value = '';
    }
    cancelReset(): void {
        if (this.isResetConfirmation) this.isResetConfirmation = false;
    }

    resetData(): void {
        // TODO truc bidon à remplacer par le vrai code
        return;
    }
}
