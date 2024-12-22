import * as vscode from 'vscode';

export const ollamaChatSnippet = new vscode.SnippetString(`
<details style="background-color: #2f2e22; margin: 21px; border: 1px solid #5c561f; border-radius: 12px; padding: 16px;" open>
<summary>\${1|system,assistant,user|}</summary>
<div class="content" style="padding: 20px 16px 0px 16px">

\${2:内容在这里添加}

</div>
</details>
`);