import * as vscode from 'vscode';
import { parseMarkdownToMessages, generateMarkdownFormatChat } from '../services/ollama';


export default async function applyMarkdownFormatChat() {
	const document = vscode.window.activeTextEditor?.document;
	if (!document || document.languageId !== 'markdown') {
        return;
    }
	const firstLine = document.lineAt(0).text;
	const secondLine = document.lineAt(1)?.text;
	if (firstLine !== '---' || secondLine !== 'ollamaChat: true') {
        return;
    }

	const lines = [];
    let i = 2;
    while (i < document.lineCount) {
        lines.push(document.lineAt(i).text);
        i++;
    }
    const markdownContent = lines.join('\n');

    const massage = parseMarkdownToMessages(markdownContent);
	const responseStream = generateMarkdownFormatChat(massage);

	const editor = vscode.window.activeTextEditor;
    if (editor) {
        for await (const response of responseStream) {
            await editor.edit(editBuilder => {
				const endPosition = editor.document.positionAt(editor.document.getText().length);
                editBuilder.insert(endPosition, response);
            });
        }
    }
}
