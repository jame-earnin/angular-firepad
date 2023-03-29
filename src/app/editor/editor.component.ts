import { Component, inject, OnInit } from '@angular/core';
import { GithubAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth, PERSISTENCE } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { combineLatest, Subject } from 'rxjs';
import { fromMonacoWithFirebase, IFirepad } from '../firepad-x';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    // ... Existing Providers
    { provide: PERSISTENCE, useValue: 'session' },
  ]
})
export class EditorComponent implements OnInit {
  private database: AngularFireDatabase = inject(AngularFireDatabase);
  auth: AngularFireAuth = inject(AngularFireAuth);
  editorOptions = { 
    language: "typescript",
    fontSize: 18,
    theme: "vs-dark",
    // @ts-ignore
    trimAutoWhitespace: false
  };
  editor: any;
  code: string = '';
  editorSubject = new Subject<any>();
  firepad: IFirepad;
  constructor() {}
  ngOnInit() {
    combineLatest([this.editorSubject.asObservable(),this.auth.user]).subscribe(([editor,user]) => {
      if (user?.uid) {
        const firepad = fromMonacoWithFirebase(this.database.database.ref(), editor, {
          userId: user.uid,
          userName: user.displayName! ,
          userColor: '#FFA611', // Firebase Color
        });
        this.firepad = firepad;
      }
    })
  }
  onInit(editor: any) {
    this.editor = editor;
    this.editorSubject.next(editor);
  }
  loginViaGithub() {
    const provider = new GithubAuthProvider();
    this.auth.signInWithPopup(provider).then((result) => {
      const credential = result.credential;
  
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const token = credential?.providerId;
  
      // The signed-in user info.
      const user = result.user;
      // IdP data available in result.additionalUserInfo.profile.
        // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }
}
