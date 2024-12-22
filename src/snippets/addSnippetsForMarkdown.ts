import * as vscode from 'vscode';
import { ollamaChatSnippet } from './snippetsForMarkdown';

export const addSnippetsForMarkdown = {
	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position){
		const firstLine = document.lineAt(0).text;
		const secondLine = document.lineAt(1)?.text;
		if (firstLine === '---' && secondLine === 'ollamaChat: true') {
			const snippetCompletion = new vscode.CompletionItem('Ollama Chat Snippet');
			snippetCompletion.insertText = ollamaChatSnippet;
			return [snippetCompletion];
		}
		return []; 
	}
};