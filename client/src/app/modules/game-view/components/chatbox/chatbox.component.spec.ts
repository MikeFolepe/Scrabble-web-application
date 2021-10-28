/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatboxComponent } from './chatbox.component';

describe('ChatBoxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            imports: [FormsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should know when Enter key is pressed', () => {
        const keyboardEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true,
        });
        spyOn(component['chatBoxService'], 'sendPlayerMessage');
        component.handleKeyEvent(keyboardEvent);
        expect(component['chatBoxService'].sendPlayerMessage).toHaveBeenCalledTimes(1);
    });

    it('should send message as System when sendSystemMessage() is called', () => {
        component.sendSystemMessage('System message');
        component.sendSystemMessage('Second system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual('system');
    });

    it('should send message as opponent when sendOpponentMessage() is called', () => {
        component.sendOpponentMessage('Opponent message');
        component.sendOpponentMessage('Opponent system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual('opponent');
    });

    it('should use the message and the type from chatBoxService when we display a message', () => {
        component['chatBoxService'].message = 'Service message';
        component['chatBoxService'].typeMessage = 'system';
        component.displayAnyMessageByType();
        expect(component.listMessages.pop()).toEqual(component['chatBoxService'].message);
        expect(component.listTypes.pop()).toEqual(component['chatBoxService'].typeMessage);
    });
});
