import * as vscode from 'vscode';
import applyGitFormatSuggestion from './commands/applyGitFormatSuggestion';
import applyMarkdownFormatChat from './commands/applyMarkdownFormatChat';
import onChangeConfiguration from './configurations/onChangeConfiguration';
import { applyGitFormatSuggestionKeymap, applyMarkdownFormatChatKeymap } from './const/vscode';
import { addSnippetsForMarkdown } from './snippets/addSnippetsForMarkdown';

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeConfiguration(onChangeConfiguration);

	context.subscriptions.push(
		vscode.commands.registerCommand(applyGitFormatSuggestionKeymap, applyGitFormatSuggestion),
		vscode.commands.registerCommand(applyMarkdownFormatChatKeymap, applyMarkdownFormatChat),
		vscode.languages.registerCompletionItemProvider('markdown', addSnippetsForMarkdown )
	);
	
}

export function deactivate() { }
