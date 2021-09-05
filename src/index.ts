import { commands, ExtensionContext, window } from "vscode";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("typedown.tsToMd", tsToMd)
  );
}

function tsToMd() {
  window.showInformationMessage("Hello World from Typedown!");
}
