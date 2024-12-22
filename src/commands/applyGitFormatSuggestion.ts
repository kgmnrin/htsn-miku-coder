import * as vscode from 'vscode';
import { generateGitFormatSuggestion } from '../services/ollama';


export default async function applyGitFormatSuggestion() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const workspaceName = vscode.workspace.name || "Unknown Workspace";
	const currentFileName = editor.document.uri.fsPath;
	const position = editor.selection.active;
	const editingLineContent = editor.document.lineAt(position.line).text;
	const beforeCursorContent = editor.document.getText(new vscode.Range(0, 0, position.line, 0));
	const afterCursorContent = editor.document.getText(new vscode.Range(position.line + 1, 0, editor.document.lineCount, 0));
	const openFiles = vscode.workspace.textDocuments.map(doc => ({
		fileName: doc.uri.fsPath,
		content: doc.getText()
	}));
	const openFilesContent =openFiles.map(file => `fileName: ${file.fileName}\ccontent:\n${file.content}\n--------------`).join('\n');

	const suggestions = generateGitFormatSuggestion(workspaceName, currentFileName, beforeCursorContent, editingLineContent, afterCursorContent, openFilesContent);
	let isFirstSuggestion = true;

	const lineEnd = new vscode.Position(position.line, editor.document.lineAt(position.line).text.length);
	if (!position.isEqual(lineEnd)) {
		editor.selection = new vscode.Selection(lineEnd, lineEnd);
	}

	for await (const suggestion of suggestions) {
		await editor.edit(editBuilder => {
			const position = editor.selection.active;
			if (isFirstSuggestion) {
				const lineRange = new vscode.Range(position.line, 0, position.line, editor.document.lineAt(position.line).text.length);
				editBuilder.replace(lineRange, suggestion);
				isFirstSuggestion = false;
			} else {
				editBuilder.insert(position, suggestion);
			}
		});
	}
}