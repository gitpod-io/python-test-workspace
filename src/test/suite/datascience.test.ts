import * as assert from 'assert';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';
import { closeAllWindows, retry } from './common';
// import * as myExtension from '../../extension';

suite('Smoke Test: notebook', () => {
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

		const juExt = await retry(async () => {
			const ext = vscode.extensions.getExtension<{ ready: Promise<void> }>('ms-toolsai.jupyter');
			if (ext) {
				return ext;
			}
			throw new Error("Extension 'ms-toolsai.jupyter' not installed");
		}, 1000, 10);
		const juApi = await juExt.activate();
		await juApi.ready;
	});

	suiteTeardown(closeAllWindows);
	teardown(closeAllWindows);

	test('Run Cell in native editor', async () => {
		const wsFolder = vscode.workspace.workspaceFolders![0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'simple_nb.ipynb');

		const outputFile = vscode.Uri.joinPath(wsFolder, 'ds_n.log');
		try {
			fs.unlinkSync(outputFile.fsPath);
		} catch (e) {
		}

		await vscode.commands.executeCommand('vscode.open', uri);

		await new Promise((r, e) => setTimeout(r, 5000));

		await vscode.commands.executeCommand<void>('jupyter.runallcells').then(undefined, (err) => {
			assert.fail(`Something went wrong running all cells in the native editor: ${err}`);
		});

		await new Promise((r, e) => setTimeout(r, 5000));

		try {
			const stat = fs.statSync(outputFile.fsPath);
			console.log(stat);
		} catch (error) {
			assert.fail();
		}
	});

	test('Run Cell in interactive window', async () => {
		const wsFolder = vscode.workspace.workspaceFolders![0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'simple_note_book.py');

		const outputFile = vscode.Uri.joinPath(wsFolder, 'ds.log');
		try {
			fs.unlinkSync(outputFile.fsPath);
		} catch (e) {
		}

		await vscode.commands.executeCommand('vscode.open', uri);

		await new Promise((r, e) => setTimeout(r, 5000));

		await vscode.commands.executeCommand<void>('jupyter.runallcells').then(undefined, (err) => {
			assert.fail(`Something went wrong running all cells in the native editor: ${err}`);
		});

		await new Promise((r, e) => setTimeout(r, 5000));

		try {
			const stat = fs.statSync(outputFile.fsPath);
			console.log(stat);
		} catch (error) {
			assert.fail();
		}
	});
});
