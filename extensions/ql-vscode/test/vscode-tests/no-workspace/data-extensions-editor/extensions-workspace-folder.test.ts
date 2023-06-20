import { Uri, workspace, WorkspaceFolder } from "vscode";
import { dir, DirectoryResult } from "tmp-promise";
import { autoPickExtensionsDirectory } from "../../../../src/data-extensions-editor/extensions-workspace-folder";

describe("autoPickExtensionsDirectory", () => {
  let tmpDir: DirectoryResult;
  let rootDirectory: Uri;
  let extensionsDirectory: Uri;

  let workspaceFoldersSpy: jest.SpyInstance<
    readonly WorkspaceFolder[] | undefined,
    []
  >;
  let workspaceFileSpy: jest.SpyInstance<Uri | undefined, []>;
  let updateWorkspaceFoldersSpy: jest.SpiedFunction<
    typeof workspace.updateWorkspaceFolders
  >;

  beforeEach(async () => {
    tmpDir = await dir({
      unsafeCleanup: true,
    });

    rootDirectory = Uri.file(tmpDir.path);
    extensionsDirectory = Uri.joinPath(
      rootDirectory,
      ".github",
      "codeql",
      "extensions",
    );

    workspaceFoldersSpy = jest
      .spyOn(workspace, "workspaceFolders", "get")
      .mockReturnValue([]);
    workspaceFileSpy = jest
      .spyOn(workspace, "workspaceFile", "get")
      .mockReturnValue(undefined);
    updateWorkspaceFoldersSpy = jest
      .spyOn(workspace, "updateWorkspaceFolders")
      .mockReturnValue(true);
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  it("when a workspace folder with the correct path exists", async () => {
    workspaceFoldersSpy.mockReturnValue([
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-java"),
        name: "codeql-custom-queries-java",
        index: 0,
      },
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-python"),
        name: "codeql-custom-queries-python",
        index: 1,
      },
      {
        uri: extensionsDirectory,
        name: "CodeQL Extension Packs",
        index: 2,
      },
    ]);

    expect(await autoPickExtensionsDirectory()).toEqual(extensionsDirectory);
    expect(updateWorkspaceFoldersSpy).not.toHaveBeenCalled();
  });

  it("when a workspace file exists", async () => {
    workspaceFoldersSpy.mockReturnValue([
      {
        uri: Uri.file("/a/b/c"),
        name: "codeql-custom-queries-java",
        index: 0,
      },
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-python"),
        name: "codeql-custom-queries-python",
        index: 1,
      },
    ]);

    workspaceFileSpy.mockReturnValue(
      Uri.joinPath(rootDirectory, "workspace.code-workspace"),
    );

    expect(await autoPickExtensionsDirectory()).toEqual(extensionsDirectory);
    expect(updateWorkspaceFoldersSpy).toHaveBeenCalledWith(2, 0, {
      name: "CodeQL Extension Packs",
      uri: extensionsDirectory,
    });
  });

  it("when updating the workspace folders fails", async () => {
    updateWorkspaceFoldersSpy.mockReturnValue(false);

    workspaceFoldersSpy.mockReturnValue([
      {
        uri: Uri.file("/a/b/c"),
        name: "codeql-custom-queries-java",
        index: 0,
      },
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-python"),
        name: "codeql-custom-queries-python",
        index: 1,
      },
    ]);

    workspaceFileSpy.mockReturnValue(
      Uri.joinPath(rootDirectory, "workspace.code-workspace"),
    );

    expect(await autoPickExtensionsDirectory()).toEqual(undefined);
  });

  it("when a workspace file does not exist and there is a common root directory", async () => {
    workspaceFoldersSpy.mockReturnValue([
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-java"),
        name: "codeql-custom-queries-java",
        index: 0,
      },
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-python"),
        name: "codeql-custom-queries-python",
        index: 1,
      },
    ]);

    expect(await autoPickExtensionsDirectory()).toEqual(extensionsDirectory);
    expect(updateWorkspaceFoldersSpy).toHaveBeenCalledWith(2, 0, {
      name: "CodeQL Extension Packs",
      uri: extensionsDirectory,
    });
  });

  it("when a workspace file does not exist and there is no common root directory", async () => {
    workspaceFoldersSpy.mockReturnValue([
      {
        uri: Uri.joinPath(rootDirectory, "codeql-custom-queries-java"),
        name: "codeql-custom-queries-java",
        index: 0,
      },
      {
        uri: Uri.file("/a/b/c"),
        name: "codeql-custom-queries-python",
        index: 1,
      },
    ]);

    expect(await autoPickExtensionsDirectory()).toEqual(undefined);
    expect(updateWorkspaceFoldersSpy).not.toHaveBeenCalled();
  });
});
