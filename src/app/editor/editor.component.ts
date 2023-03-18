import { Component, OnInit, ViewChild } from '@angular/core';
import { Database } from '@angular/fire/database/firebase';

import { EditorComponent as MonacoEditor } from 'ngx-monaco-editor-v2';
import * as monaco from "monaco-editor";

import { fromMonaco } from "@hackerrank/firepad";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild(EditorComponent, { static: true }) editor!: MonacoEditor;
  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  constructor(private database: Database) {}
  ngOnInit() {
    monaco
    this.database
    const databaseRef: string | firebase.database.Reference = this.database; // Path to Firebase Database or a Reference Object

    const editor: monaco.editor.IEditor = ...; // Monaco Editor Instance

    const firepad = fromMonaco(this.database, this.editor._editor as any);

  
  }
}
