import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { fromMonacoWithFirebase } from '../firepad-x';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  private database: AngularFireDatabase = inject(AngularFireDatabase);
  editorOptions = { 
    language: "typescript",
    fontSize: 18,
    theme: "vs-dark",
    // @ts-ignore
    trimAutoWhitespace: false
 };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  constructor() {}
  ngOnInit() {}
  onInit(editor: any) {
      const firepad = fromMonacoWithFirebase(this.database.database.ref(), editor, {
        userId: crypto.randomUUID(),
        userColor: 'yellow',
      });
  }
}
