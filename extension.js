const { workspace, window, commands } = require('vscode');
const shell = require('node-powershell');

function activate(context) {

    const config = () => workspace.getConfiguration('transparentvsc');

    console.log('ctx', process.platform);
    if (process.platform == 'win32') {
        const path = context.asAbsolutePath('./SetTransparency.cs');

        // Encode path as UTF-16LE Base64 so non-ASCII characters (ä, ö, ü, ...)
        // in Windows usernames are passed correctly to PowerShell
        const pathBase64 = Buffer.from(path, 'utf16le').toString('base64');

        const ps = new shell({
            executionPolicy: 'RemoteSigned',
            noProfile: true,
        });
        context.subscriptions.push(ps);
        ps.addCommand('[Console]::OutputEncoding = [Text.Encoding]::UTF8');
        ps.addCommand(`$csPath = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('${pathBase64}'))`);
        ps.addCommand(`Add-Type -LiteralPath $csPath`);

        function setAlpha(alpha) {
            if (alpha < 1) {
                alpha = 1;
            } else if (alpha > 255) {
                alpha = 255;
            }

            ps.addCommand(`[GlassIt.SetTransParency]::SetTransParency(${process.pid}, ${alpha})`);
            ps.invoke().then(res => {
                console.log(res);
                console.log(`TransparentVSC: set alpha ${alpha}`);
                config().update('alpha', alpha, true);
            }).catch(err => {
                console.error(err);
                window.showErrorMessage(`TransparentVSC Error: ${err}`);
            });
        }

        context.subscriptions.push(commands.registerCommand('transparentvsc.increase', () => {
            const alpha = config().get('alpha') - config().get('step');
            setAlpha(alpha);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.decrease', () => {
            const alpha = config().get('alpha') + config().get('step');
            setAlpha(alpha);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.maximize', () => {
            setAlpha(1);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.minimize', () => {
            setAlpha(255);
        }));

        const alpha = config().get('alpha');
        setAlpha(alpha);

    } else if (process.platform == 'linux') {

        const cp = require('child_process');
        const codeWindowIds = [];

        if (config().get('force_sway') === false) {
            try {
                cp.spawnSync('which xprop').toString();
            } catch (error) {
                console.error(`TransparentVSC Error: Please install xprop package to use TransparentVSC.`);
                return;
            }

            const process_name = process.execPath.substring(process.execPath.lastIndexOf('/') + 1);
            const processIds = cp.execSync(`pgrep ${process_name}`).toString().split('\n');
            processIds.pop();

            const allWindowIdsOutput = cp.execSync(
                `xprop -root | grep '_NET_CLIENT_LIST(WINDOW)'`
            ).toString();

            const allWindowIds = allWindowIdsOutput.match(/0x[\da-f]+/ig);

            for (const windowId of allWindowIds) {
                const hasProcessId = cp.execSync(`xprop -id ${windowId} _NET_WM_PID`).toString();

                if (!(hasProcessId.search('not found') + 1)) {
                    const winProcessId = hasProcessId.replace(/([a-zA-Z_\(\)\s\=])/g, '');
                    if (processIds.includes(winProcessId)) {
                        codeWindowIds.push(windowId);
                    }
                }
            }
        }

        function setAlpha(alpha) {
            if (alpha < 1) {
                alpha = 1;
            } else if (alpha > 255) {
                alpha = 255;
            }

            if (config().get('force_sway') === true) {
                console.log(`In force_sway mode...`);
                cp.exec(`swaymsg opacity ${(alpha / 255).toFixed(2)}`, function (error, stdout, stderr) {
                    if (error) {
                        console.error(`TransparentVSC error: ${error}`);
                        return;
                    }
                    console.log(stdout.toString());
                    console.log(`TransparentVSC: set alpha ${alpha}`);
                    config().update('alpha', alpha, true);
                });
            } else {
                for (const codeWindowId of codeWindowIds) {
                    cp.exec(`xprop -id ${codeWindowId} -f _NET_WM_WINDOW_OPACITY 32c -set _NET_WM_WINDOW_OPACITY $(printf 0x%x $((0xffffffff * ${alpha} / 255)))`, function (error, stdout, stderr) {
                        if (error) {
                            console.error(`TransparentVSC error: ${error}`);
                            return;
                        }
                        console.log(stdout.toString());
                        console.log(`TransparentVSC: set alpha ${alpha}`);
                        config().update('alpha', alpha, true);
                    });
                }
            }
        }

        context.subscriptions.push(commands.registerCommand('transparentvsc.increase', () => {
            const alpha = config().get('alpha') - config().get('step');
            setAlpha(alpha);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.decrease', () => {
            const alpha = config().get('alpha') + config().get('step');
            setAlpha(alpha);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.maximize', () => {
            setAlpha(1);
        }));

        context.subscriptions.push(commands.registerCommand('transparentvsc.minimize', () => {
            setAlpha(255);
        }));

        const alpha = config().get('alpha');
        setAlpha(alpha);

    } else {
        return;
    }

    console.log('TransparentVSC is now active!');
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
