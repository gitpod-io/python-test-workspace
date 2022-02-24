import * as assert from 'assert';
import * as cp from 'child_process';
import * as path from 'path';

import * as vscode from 'vscode';
import { closeAllWindows, retry } from './common';
// import * as myExtension from '../../extension';

suite('Smoke Test: LSP and Debugging', () => {
	suiteSetup(async function () {
		// Installing initial extensions is async so let's retry a few times so they all finished installing
		const pyExt = await retry(async () => {
			const ext = vscode.extensions.getExtension<{ ready: Promise<void> }>('ms-python.python');
			if (ext) {
				return ext;
			}
			throw new Error("Extension 'ms-python.python' not installed");
		}, 1000, 10);
		const pyApi = await pyExt.activate();
		await pyApi.ready;
	});

	suiteTeardown(closeAllWindows);
	teardown(closeAllWindows);

	test('python test', async () => {
		const wsFolder = vscode.workspace.workspaceFolders![0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'file.py');
		await vscode.commands.executeCommand('vscode.open', uri);
		const active = vscode.window.activeTextEditor;

		const docUri = active!.document.uri;
		const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', docUri);
		assert.strictEqual(symbols?.length, 5);
		// console.log(`python symbols:`);
		// console.log(symbols?.length);

		let hovers = await vscode.commands.executeCommand<vscode.Hover[]>('vscode.executeHoverProvider', docUri, new vscode.Position(36, 10));
		assert.strictEqual(hovers?.length, 1);
		// console.log(hovers?.length);
	});

	test('python debug test', async () => {
		const wsFolder = vscode.workspace.workspaceFolders![0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'file.py');
		vscode.debug.addBreakpoints([new vscode.SourceBreakpoint(new vscode.Location(uri, new vscode.Position(32, 0)), true)]);

		const toDispose: vscode.Disposable[] = [];
		let breakpointHit: () => void;
		const breakpointHitPromise = new Promise<void>(resolve => breakpointHit = resolve);
		toDispose.push(vscode.debug.registerDebugAdapterTrackerFactory('*', {
			createDebugAdapterTracker: () => ({
				onDidSendMessage: m => {
					if (m.event === 'stopped') {
						breakpointHit();
					}
				}
			})
		}));

		const success = await vscode.debug.startDebugging(vscode.workspace.workspaceFolders![0], 'Python: Current File');
		assert.strictEqual(success, true);

		await breakpointHitPromise;

		await vscode.commands.executeCommand('workbench.action.debug.stop');
	});
});