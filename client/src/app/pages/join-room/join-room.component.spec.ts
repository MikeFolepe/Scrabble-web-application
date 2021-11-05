// TODO faire les tests
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule } from '@angular/material/dialog';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ClientSocketService } from '@app/services/client-socket.service';
// import { JoinRoomComponent } from './join-room.component';

// describe('JoinRoomComponent', () => {
//     let component: JoinRoomComponent;
//     let fixture: ComponentFixture<JoinRoomComponent>;
//     let clientSocketServiceSpyjob: jasmine.SpyObj<ClientSocketService>;

//     beforeEach(() => {
//         clientSocketServiceSpyjob = jasmine.createSpyObj('ClientSocketService', ['connect', 'emit', 'route']);
//     });

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [JoinRoomComponent],
//             imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
//             providers: [
//                 {
//                     provide: MatDialogModule,
//                     useValue: {},
//                 },
//                 {
//                     provide: ClientSocketService,
//                     useValue: { clientSocketServiceSpyjob },
//                 },
//             ],
//             schemas: [NO_ERRORS_SCHEMA],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(JoinRoomComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should return the state of room is the state is waiting', () => {
//         expect(component.computeRoomState(0)).toEqual('Indisponible');
//     });

//     it('should return the state of room is the state is Playing', () => {
//         expect(component.computeRoomState(1)).toEqual('En attente');
//     });
// });
