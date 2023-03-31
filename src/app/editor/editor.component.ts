import { Component, inject, OnInit } from '@angular/core';
import { GithubAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth, PERSISTENCE } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject, tap } from 'rxjs';
import { fromMonacoWithFirebase, IFirepad } from '../firepad-x';

interface Result {
  result?: string;
  logs?: string;
  error?: string;
}

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
    language: "javascript",
    fontSize: 18,
    theme: "vs-dark",
    // @ts-ignore
    trimAutoWhitespace: false
  };
  editor: any;
  code: string = '';
  editorSubject = new Subject<any>();
  firepad: IFirepad;
  result$: Observable<Result> = of<Result>({result: '', logs: ''});
  isLogin: boolean | null = null;
  constructor(
    private fns: AngularFireFunctions,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit() {
    const roomID = this.route.snapshot.queryParamMap.get('room') || '/';
    let ref = this.database.database.ref(roomID);
    if (ref.key === this.database.database.ref().root.key) {
        console.log('room not found, create new room');
        ref = this.database.database.ref().push();
        this.router.navigate([], { queryParams: { room: ref.key} })
    }
    combineLatest([this.editorSubject.asObservable(),this.auth.user.pipe(tap(user => {
      if (user) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    }))]).subscribe(([editor,user]) => {
      if (user?.uid) {
        const firepad = fromMonacoWithFirebase(ref, editor, {
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
  run() {
    const callable = this.fns.httpsCallable('runCallableJS');
    this.result$ = callable({ code: this.code }).pipe(
      tap({
        next: (result) => {
          const err = result?.error;
           if (err) {
             this.snackBar.open(err, undefined, { duration: 3000})
             if (err === 'You are banned') {
               this.auth.signOut();
               // window.close();
             }
           }
        },
        error: (err) => {
          this.snackBar.open(err, undefined, { duration: 3000})
        }
      })
    )
  }
}
