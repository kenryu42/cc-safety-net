# OpenCode compatibility

CC Safety Net supports OpenCode 1.18.29+ and 2.0.6+. Both use the same npm package.
Older v1 releases do not support the combined plugin entrypoint. Upgrade OpenCode before
updating CC Safety Net.

For TypeScript imports, use `CCSafetyNetPlugin` or the default plugin's `server` from
`cc-safety-net` with the v1 SDK. Use the default export from `cc-safety-net/opencode/v2`
with the v2 SDK. Each entry's declarations require only its own generation's optional
peer. Both entries load the same runtime plugin; automatic installation is unchanged.

```sh
npx -y cc-safety-net@latest install --opencode
```

The installer checks the host version. For v2 it runs `opencode plugin add`, then
`opencode plugin update` only when `add` reports the plugin already configured (the background
service does not know a newly added plugin yet). It then waits up to about 15 seconds for the
service to list the plugin and checks the package ID and source in `opencode plugin list`.
That listing confirms discovery, not activation, so the installer then asks the host for
activation state with the same check as `doctor` below. If OpenCode marks the plugin failed and
no copy of it is active, the install fails with the first line of OpenCode's error; if the host
lists no active copy at all, the install fails too. The GUI's Enable button runs this install. As with v1, protection requires a loaded integration.

On v2, when the config OpenCode loads has a `cc-safety-net` entry, `doctor` and the GUI ask the
host for activation state. They run `opencode api integration.list`, then
`opencode api plugin.list` for the current directory. If OpenCode marks the plugin failed and
no copy of it is active, `doctor` reports it as not configured with the first line of
OpenCode's error, and the GUI shows it as disabled. These commands may start OpenCode's
persistent background service, as the installer and the v2 TUI already do. On v1, `doctor` and
the GUI still read only the config.

If an existing global config uses `cc-safety-net` or a pinned version, the v2 installer stops
before changing it. Change that entry's package spec to `cc-safety-net@latest`, keeping its
options and comments, then retry. This avoids creating duplicate plugin IDs.

## V2 shell configuration

V2's tool event does not identify the shell executable. CC Safety Net therefore analyzes
`shell` calls as POSIX on Unix and PowerShell on Windows, and verifies the actual executable
before OpenCode starts a shell. It rejects an executable from another dialect or an unsupported
executable rather than analyzing with the wrong parser.

If you use PowerShell on Unix, or Git Bash on Windows, set the plugin's expected dialect:

```json
{
  "plugins": [
    {
      "package": "cc-safety-net@latest",
      "options": { "shell": "powershell" }
    }
  ]
}
```

Use `"posix"` for a POSIX shell (ash, bash, dash, ksh, ksh93, lksh, mksh, oksh, pdksh, posh, rbash, rksh, sh, yash, zsh); use `"powershell"` for powershell or pwsh.
This option does not select OpenCode's executable. It must match the executable OpenCode uses.
Unsupported shells, including cmd.exe, fish, and nushell, are rejected.

OpenCode's shell hook has no typed denial channel or session ID. A dialect mismatch stops
before spawn but may fail the current operation rather than return an ordinary tool denial.
It has no session-attributed CC Safety Net audit entry. This consistency check applies to all
shell creation in the plugin's location, including shell operations outside agent tool calls.

## Protection and commands

V1's `bash` and v2's `shell` use the same policy, analyzer, and audit code. The v2 tool-before
hook returns typed `Tool.Error` denials. It also checks read, edit, write, patch, grep, glob,
and unknown-tool inputs through the existing input routes. Code Mode's child tool calls cross
the same OpenCode hook; CC Safety Net does not interpret the outer Code Mode JavaScript.

V2 registers `/cc-safety-net` through the command API, preserving a command of that name
already present when the plugin loads. Use it to explain blocks and operate CC Safety Net.

The shell consistency check is not an operating-system sandbox. It does not inspect commands
that bypass the tool hook, or protect against trusted plugins rewriting a command after inspection.
The standard, strict, and paranoid contracts in [SECURITY.md](../SECURITY.md) remain unchanged.
