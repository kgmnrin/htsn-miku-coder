import * as vscode from 'vscode';
import { defaultHost, defaultModel } from '../configurations/activateConfigs';
import { ollamaClientHostConfigurationKey, ollamaUsingModelConfigurationKey } from '../const/vscode';
import { updateOllamaClient, updateOllamaUsingModel } from '../services/ollama';

export default function onChangeConfiguration(event: vscode.ConfigurationChangeEvent){
	const config = vscode.workspace.getConfiguration();
	if (event.affectsConfiguration(ollamaClientHostConfigurationKey)) {
		updateOllamaClient(config.get<string>(ollamaClientHostConfigurationKey, defaultHost));
	}
	if (event.affectsConfiguration(ollamaUsingModelConfigurationKey)) {
		updateOllamaUsingModel(config.get<string>(ollamaUsingModelConfigurationKey, defaultModel));
	}
}