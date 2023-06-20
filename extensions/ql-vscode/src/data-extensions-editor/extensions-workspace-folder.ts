import { Uri, window, workspace, WorkspaceFolder } from "vscode";
import { getOnDiskWorkspaceFoldersObjects } from "../common/vscode/workspace-folders";
import { extLogger } from "../common";

/**
 * Returns the ancestors of this path in order from furthest to closest (i.e. root of filesystem to parent directory)
 */
function getAncestors(uri: Uri): Uri[] {
  const ancestors: Uri[] = [];
  let current = uri;
  while (current.fsPath !== Uri.joinPath(current, "..").fsPath) {
    ancestors.push(current);
    current = Uri.joinPath(current, "..");
  }

  // The ancestors are now in order from closest to furthest, so reverse them
  ancestors.reverse();

  return ancestors;
}

function getRootWorkspaceDirectory(): Uri | undefined {
  // If there is a valid workspace file, just use its directory as the directory for the extensions
  const workspaceFile = workspace.workspaceFile;
  if (workspaceFile?.scheme === "file") {
    return Uri.joinPath(workspaceFile, "..");
  }

  const workspaceFolders = getOnDiskWorkspaceFoldersObjects();

  // Find the common root directory of all workspace folders by finding the longest common prefix
  const commonRoot = workspaceFolders.reduce((commonRoot, folder) => {
    const folderUri = folder.uri;
    const ancestors = getAncestors(folderUri);

    const minLength = Math.min(commonRoot.length, ancestors.length);
    let commonLength = 0;
    for (let i = 0; i < minLength; i++) {
      if (commonRoot[i].fsPath === ancestors[i].fsPath) {
        commonLength++;
      } else {
        break;
      }
    }

    return commonRoot.slice(0, commonLength);
  }, getAncestors(workspaceFolders[0].uri));

  if (commonRoot.length === 0) {
    return undefined;
  }

  // The path closest to the workspace folders is the last element of the common root
  const commonRootUri = commonRoot[commonRoot.length - 1];

  // If we are at the root of the filesystem, we can't go up any further and there's something
  // wrong, so just return undefined
  if (commonRootUri.fsPath === Uri.joinPath(commonRootUri, "..").fsPath) {
    return undefined;
  }

  return commonRootUri;
}

export async function autoPickExtensionsDirectory(): Promise<Uri | undefined> {
  const workspaceFolders = getOnDiskWorkspaceFoldersObjects();

  // If there's only 1 workspace folder, use the `.github/codeql/extensions` directory in that folder
  if (workspaceFolders.length === 1) {
    return Uri.joinPath(
      workspaceFolders[0].uri,
      ".github",
      "codeql",
      "extensions",
    );
  }

  // Now try to find a workspace folder for which the path ends in `.github/codeql/extensions`
  const workspaceFolderForExtensions = workspaceFolders.find((folder) =>
    // Using path instead of fsPath because path always uses forward slashes
    folder.uri.path.endsWith(".github/codeql/extensions"),
  );
  if (workspaceFolderForExtensions) {
    return workspaceFolderForExtensions.uri;
  }

  // Get the root workspace directory, i.e. the common root directory of all workspace folders
  const rootDirectory = getRootWorkspaceDirectory();
  if (!rootDirectory) {
    void extLogger.log("Unable to determine root workspace directory");

    return undefined;
  }

  // We'll create a new workspace folder for the extensions in the root workspace directory
  // at `.github/codeql/extensions`
  const extensionsUri = Uri.joinPath(
    rootDirectory,
    ".github",
    "codeql",
    "extensions",
  );

  if (
    !workspace.updateWorkspaceFolders(
      workspace.workspaceFolders?.length ?? 0,
      0,
      {
        name: "CodeQL Extension Packs",
        uri: extensionsUri,
      },
    )
  ) {
    void extLogger.log(
      `Failed to add workspace folder for extensions at ${extensionsUri.fsPath}`,
    );
    return undefined;
  }

  return extensionsUri;
}

export async function askForWorkspaceFolder(): Promise<
  WorkspaceFolder | undefined
> {
  const workspaceFolders = getOnDiskWorkspaceFoldersObjects();
  const workspaceFolderOptions = workspaceFolders.map((folder) => ({
    label: folder.name,
    detail: folder.uri.fsPath,
    folder,
  }));

  // We're not using window.showWorkspaceFolderPick because that also includes the database source folders while
  // we only want to include on-disk workspace folders.
  const workspaceFolder = await window.showQuickPick(workspaceFolderOptions, {
    title: "Select workspace folder to create extension pack in",
  });
  if (!workspaceFolder) {
    return undefined;
  }

  return workspaceFolder.folder;
}
