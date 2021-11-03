/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatboxComponent } from '@app/modules/game-view//chatbox/chatbox.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ONE_SECOND_DELAY } from '@app/classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { TypeMessage } from '@app/classes/enum';

describe('ChatBoxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        jasmine.clock().install();
        component = fixture.componentInstance;
        component.ngAfterViewInit();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        fixture.detectChanges();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call bindDisplay on init', () => {
        const spy = spyOn<any>(component['sendMessageService'], 'displayBound').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should know when Enter key is pressed', () => {
        const enterEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true,
        });
        const notEnterEvent = new KeyboardEvent('keydown', {
            code: 'test',
            key: 'test',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true,
        });
        spyOn(component['chatBoxService'], 'sendPlayerMessage');
        spyOn(component, 'scrollToBottom').and.callThrough();
        component.handleKeyEvent(notEnterEvent);
        expect(component['chatBoxService'].sendPlayerMessage).not.toHaveBeenCalledTimes(1);

        component.handleKeyEvent(enterEvent);
        expect(component['chatBoxService'].sendPlayerMessage).toHaveBeenCalledTimes(1);
        jasmine.clock().tick(2);
        expect(component.scrollToBottom).toHaveBeenCalledTimes(1);
    });

    it('should send message as System when sendSystemMessage() is called', () => {
        component.sendSystemMessage('System message');
        component.sendSystemMessage('Second system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual(TypeMessage.System);
    });

    it('should send message as opponent when sendOpponentMessage() is called', () => {
        component.sendOpponentMessage('Opponent message');
        component.sendOpponentMessage('Opponent system message');
        expect(component.listTypes).toHaveSize(2);
        expect(component.listMessages).toHaveSize(2);
        expect(component.listTypes[0]).toEqual(TypeMessage.Opponent);
    });

    it('should use the message and the type from sendMessageService when we display a message', () => {
        component['sendMessageService'].message = 'Service message';
        component['sendMessageService'].typeMessage = TypeMessage.System;
        component.displayMessageByType();
        expect(component.listMessages.pop()).toEqual(component['sendMessageService'].message);
        expect(component.listTypes.pop()).toEqual(component['sendMessageService'].typeMessage);
    });

    it('Clicking in the chatbox should call cancelPlacement from BoardHandlerService', () => {
        spyOn(component['boardHandlerService'], 'cancelPlacement');
        const event = new MouseEvent('mouseup');
        fixture.elementRef.nativeElement.dispatchEvent(event);
        expect(component['boardHandlerService'].cancelPlacement).toHaveBeenCalled();
    });

    it('should set interval for all required functions', () => {
        const spy1 = spyOn(component['endGameService'], 'checkEndGame');
        const spy2 = spyOn(component['chatBoxService'], 'displayFinalMessage');
        const spy3 = spyOn(component['endGameService'], 'getFinalScore');
        component['endGameService'].isEndGame = true;
        component.ngAfterViewInit();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });
});
