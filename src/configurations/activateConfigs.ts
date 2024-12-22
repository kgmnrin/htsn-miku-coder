import * as vscode from 'vscode';
import { ollamaClientHostConfigurationKey, ollamaUsingModelConfigurationKey } from '../const/vscode';

export const defaultHost = "http://localhost:11434";
export const defaultModel = "llama3.2:3b";
const config = vscode.workspace.getConfiguration();
export const activateOllamaClientHost = config.get<string>(ollamaClientHostConfigurationKey, defaultHost);
export const activateOllamaUsingModel = config.get<string>(ollamaUsingModelConfigurationKey, defaultModel);