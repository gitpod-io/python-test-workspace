import * as vscode from 'vscode';

export async function closeAllWindows() {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
}

export function timeout(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export interface ITask<T> {
	(): T;
}

export async function retry<T>(task: ITask<Promise<T>>, delay: number, retries: number): Promise<T> {
	let lastError: Error | undefined;

	for (let i = 0; i < retries; i++) {
		try {
			return await task();
		} catch (error) {
			lastError = error as any;

			await timeout(delay);
		}
	}

	throw lastError;
}
