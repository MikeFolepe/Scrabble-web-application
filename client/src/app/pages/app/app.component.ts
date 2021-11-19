import { Component } from '@angular/core';
// eslint-disable-next-line no-restricted-imports
// import { BestScoresComponent } from '../best-scores/best-scores.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(/* private dialogReference: MatDialog*/) {}
    // showBestScoresModal() {
    //     this.dialogReference.open(BestScoresComponent);
    // }
}
