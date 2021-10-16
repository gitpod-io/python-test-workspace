import * as assert from 'assert';
import * as cp from 'child_process';
import * as path from 'path';

import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	suiteSetup(async function () {
		console.log(`root ${vscode.env.appRoot}`);
		// console.log(JSON.stringify(process.env));
		// cp.execSync('code --install-extension ms-python.python', { cwd: path.join(vscode.env.appRoot, 'bin'), env: process.env });
		const ext = vscode.extensions.getExtension<unknown>('ms-python.python');
		console.log(ext?.id);
		await ext?.activate();
	});

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});

	test('python test', async () => {
		const wsFolder = vscode.workspace.workspaceFolders?.[0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'file.py');
		await vscode.commands.executeCommand('vscode.open', uri);
		let symbols = await vscode.commands.executeCommand<(vscode.SymbolInformation & vscode.DocumentSymbol)[]>('vscode.executeDocumentSymbolProvider', uri);
		console.log(`python symbols:`);
		console.log(symbols?.length);
	});
});