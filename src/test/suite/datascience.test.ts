import * as assert from 'assert';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Smoke Test: notebook', () => {
	suiteSetup(async function () {
		const ext = vscode.extensions.getExtension<{ ready: Promise<void> }>('ms-python.python')!;
		const api = await ext.activate();
		await api.ready;
	});

	test('Run Cell in native editor', async () => {
		const wsFolder = vscode.workspace.workspaceFolders![0].uri!;
		let uri = vscode.Uri.joinPath(wsFolder, 'simple_nb.ipynb');

		// const fileContents = await fs.readFile(file, { encoding: 'utf-8' });
		// const outputFile = path.join(path.dirname(file), 'ds_n.log');
		// await fs.writeFile(file, fileContents.replace("'ds_n.log'", `'${outputFile.replace(/\\/g, '/')}'`), {
		//     encoding: 'utf-8',
		// });

		const outputFile = vscode.Uri.joinPath(wsFolder, 'ds_n.log');
		try {
			fs.unlinkSync(outputFile.fsPath);
		} catch (e) {
		}

		await vscode.commands.executeCommand('jupyter.opennotebook', uri);

		// Wait for 15 seconds for notebook to launch.
		// Unfortunately there's no way to know for sure it has completely loaded.
		await new Promise((r, e) => setTimeout(r, 10000));

		await vscode.commands.executeCommand<void>('jupyter.notebookeditor.runallcells').then(undefined, (err) => {
			assert.fail(`Something went wrong running all cells in the native editor: ${err}`);
		});

		await new Promise((r, e) => setTimeout(r, 5000));

		try {
			const stat = fs.statSync(outputFile.fsPath);
			console.log(stat);
		} catch (error) {
			assert.fail();
		}
	})
});
