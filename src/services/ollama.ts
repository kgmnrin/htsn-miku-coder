import { defaultHost, defaultModel, activateOllamaClientHost } from '../configurations/activateConfigs';
import { Ollama, Message } from 'ollama';

let ollamaClient: Ollama = new Ollama({host: activateOllamaClientHost || defaultHost});
let usingModel = defaultModel;

export async function updateOllamaClient(host: string) {
	try{
		ollamaClient = new Ollama({host: host});
	} catch (error) {
		ollamaClient = new Ollama({host: defaultHost});
		console.error('Failed to update Ollama client. Falling back to default host.');
	}
}

export async function updateOllamaUsingModel(model: string) {
	usingModel = model || defaultModel;
}

export async function* generateGitFormatSuggestion(
	workspaceName: string,
	currentFileName: string,
	beforeCursorContent: string,
	editingLine: string,
	afterCursorContent: string,
	openFilesContent: string
): AsyncIterable<string> {
	let responseStream = await ollamaClient.chat({
		model: usingModel,
		messages: [
			{
				role: 'system',
				content: `
You are a code assistant embedded in VS Code. Your task is to provide highly relevant and contextual code completions. Consider the following details:

Current project name：${workspaceName}
Current editing file name：${currentFileName}
--------------
Code content before the current line：
--------------
${beforeCursorContent}
--------------
Line number currently being edited：
--------------
${editingLine}
--------------
Code content after the current line：
--------------
${afterCursorContent}
--------------
Content of all opened files：
--------------
${openFilesContent}
--------------
Based on this information, generate a concise and accurate code suggestion that seamlessly integrates with the provided context. Ensure the completion respects the coding style, conventions, and structure of the surrounding code.

Avoid using '>>>>>>>' or similar symbols in your response, as they will interfere with Git functionality.
`
			},
		],
		stream: true,
	});

	yield `<<<<<<< You\n${editingLine}\n=======\n`;
	for await (const chunk of responseStream) {
		yield chunk.message.content;
	}
	yield "\n>>>>>>> AI suggestion";
}

export function parseMarkdownToMessages(content: string): Message[] {
	let messages: Message[] = [];
	const detailsRegex = /<details[^>]*open[^>]*>\s*<summary>(.*?)<\/summary>.*?<div[^>]*class="content"[^>]*>(.*?)<\/div>.*?<\/details>/gs;
	let match;
	
	while ((match = detailsRegex.exec(content)) !== null) {
		const role = match[1].trim();
		const context = match[2].trim();
		messages.push({ role: role, content: context });
	}
	
	return messages;
}

export async function* generateMarkdownFormatChat(
	messages: Message[],
): AsyncIterable<string> {
	let responseStream = await ollamaClient.chat({
		model: usingModel,
		messages: messages,
		stream: true,
	});

	yield `<details style="background-color: #2f2e22; margin: 21px; border: 1px solid #5c561f; border-radius: 12px; padding: 16px;" open>
<summary>assistant</summary>
<div class="content" style="padding: 20px 16px 0px 16px">

`;
	for await (const chunk of responseStream) {
		yield chunk.message.content;
	}
	yield `

</div>
</details>
`;
}