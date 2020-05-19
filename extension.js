const vscode = require('vscode');
let fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('classcreator.makeclass', async function () {
		let name = await vscode.window.showInputBox();
		if (name !== undefined) {
			name = name.charAt(0).toUpperCase() + name.slice(1) 

			const wsedit = new vscode.WorkspaceEdit();
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
			
			const filePathCPP = vscode.Uri.file(wsPath + '/' + name + '.cpp');
			const filePathHPP = vscode.Uri.file(wsPath + '/' + name + '.hpp');
			
			wsedit.createFile(filePathCPP, { ignoreIfExists: true });
			wsedit.createFile(filePathHPP, { ignoreIfExists: true });
			
			vscode.workspace.applyEdit(wsedit);

			let classcpp =  "#include \"" + name + ".hpp\"\n\n" +
							name + "::" + name + "() {}\n\n" +
							name + "::" + name + "(const " + name + "&object) {}\n\n" +
							name + " &" + name + "::operator=(const " + name + " &object) {\n	return (*this);\n}\n\n" +
							name + "::~" + name + "() {\n	std::cout << \"Destructor called\" << std::endl;\n}\n";
		
			let classhpp =	"#ifndef " + name.toUpperCase() + "_HPP\n" +
							"#define " + name.toUpperCase() + "_HPP\n\n" +
							"#include <iostream>\n\n" +
							"class " + name + " {\n" +
							"	private:\n" +
							"	public:\n" +
							"		" + name + "();\n" +
							"		" + name + "(const " + name + "&);\n" +
							"		~" + name + "();\n" +
							"		" + name + " &operator=(const " + name + "&);\n" +
							"};\n\n" +
							"#endif";

			fs.writeFile(filePathCPP.fsPath, classcpp, function (err) { if (err) return console.log(err); });
			fs.writeFile(filePathHPP.fsPath, classhpp, function (err) { if (err) return console.log(err); });

			vscode.window.showInformationMessage("Files : " + name + ".cpp, " + name + ".hpp created !");
		}
	});
	context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}