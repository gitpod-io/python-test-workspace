import * as vscode from 'vscode';

export async function closeAllWindows() {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
}
