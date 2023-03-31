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
  private fns: AngularFireFunctions = inject(AngularFireFunctions);
  private auth: AngularFireAuth = inject(AngularFireAuth);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private snackBar: MatSnackBar = inject(MatSnackBar);
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
  result$: Observable<Result | null> = of<Result>({result: '', logs: ''});
  isLogin: boolean | null = null;
  roomID = '';
  constructor() {}
  ngOnInit() {
    const roomID = this.route.snapshot.queryParamMap.get('room') || '/';
    let ref = this.database.database.ref(roomID);
    if (ref.key === this.database.database.ref().root.key) {
        console.log('room not found, create new room');
        ref = this.database.database.ref().push();
        this.router.navigate([], { queryParams: { room: ref.key} })
    }
    this.roomID = ref.key!;
    this.result$ = this.database.object<Result>(`${this.roomID}/results`).valueChanges();
    combineLatest([this.editorSubject.asObservable(),this.auth.user.pipe(
      tap(user => {
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
  signInViaGithub() {
    const provider = new GithubAuthProvider();
    this.auth.signInWithPopup(provider).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.error(error);
    });
  }
  run() {
    const callable = this.fns.httpsCallable('runCallableJS');
    callable({ code: this.code, roomID: this.roomID }).subscribe({
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
  }
  signOut() {
    this.auth.signOut();
  }
}
