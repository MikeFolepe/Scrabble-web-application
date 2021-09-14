import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {  //https://stackoverflow.com/questions/35232731/angular-2-scroll-to-bottom-chat-style

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }
  
  message: string = "";
  type: string ="";
  listMessages:string[] = [];

  keyEvent(event: KeyboardEvent)
  {
    if(event.key === "Enter")
    {
      event.preventDefault();
      this.sendPlayerCommand();
      console.log(this.listMessages);
    }
  }

  sendPlayerCommand()
  {
    if(this.validate())
    {
      this.type = "player";
    }
    else{
      this.type = "error";
    }
    this.listMessages.push(this.message); // Add le message et update l'affichage de la chatbox
    this.message = "";                    // Clear l'input 
    this.scrollToBottom();          
  }

  //TODO VALIDATION
  validate(): boolean
  {
    // Check les erreurs ici (syntaxe, invalide, impossible à exécuter)
    return true;
  }

  scrollToBottom(): void {
    
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
                  
  }
}
