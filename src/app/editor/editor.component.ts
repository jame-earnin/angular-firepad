import { Component, OnInit, ViewChild } from '@angular/core';
import { Database } from '@angular/fire/database/firebase';

import { EditorComponent as MonacoEditor } from '@angular-firepad/ngx-monaco-editor';
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
    const firepad = fromMonaco(this.database, this.editor._editor);
  }
}
