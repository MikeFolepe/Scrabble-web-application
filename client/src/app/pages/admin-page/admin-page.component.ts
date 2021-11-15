import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

interface Dictionnary {
    name: string;
    description: string;
    isDefault: boolean;
}

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    @ViewChild(MatAccordion) accordion: MatAccordion;

    dictionaries: Dictionnary[] = [
        { name: 'Dico #1', description: 'Dictionnaire par défaut', isDefault: true },
        { name: 'Dico #2', description: 'blabla blablabla #2', isDefault: false },
        { name: 'Dico #3', description: 'blabla blablabla #3', isDefault: false },
        { name: 'Dico #4', description: 'blabla blablabla #4', isDefault: false },
    ];
    beginnerNames = ['Name #1', 'Name #2', 'Name #3', 'Name #4'];
    expertNames = ['Name #1', 'Name #2', 'Name #3'];
}
