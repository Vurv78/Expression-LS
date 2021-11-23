/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
	LanguageClient,
	LanguageClientOptions
} from "vscode-languageclient/browser";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join("server", "dist", "web", "server.js")
	);

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: "file", language: "expression2" }],
		synchronize: {
			// Notify the server about file changes to ".clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc")
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		"e2ls",
		"E2 Language Server",
		clientOptions,
		new Worker(serverModule)
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
