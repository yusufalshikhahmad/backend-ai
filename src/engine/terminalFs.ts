export type VNode =
  | { type: 'dir'; children: Record<string, VNode> }
  | { type: 'file'; content: string };

export const INITIAL_CWD = '/home/engineer/ai-backend';

export function createInitialFs(): VNode {
  return {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          engineer: {
            type: 'dir',
            children: {
              'ai-backend': {
                type: 'dir',
                children: {
                  '.env.example': {
                    type: 'file',
                    content: 'APP_ENV=development\nMODEL_PORT=8000\nLOG_LEVEL=info',
                  },
                  'README.md': {
                    type: 'file',
                    content: '# AI Backend Workspace\nRun FastAPI services from src/main.py',
                  },
                  src: {
                    type: 'dir',
                    children: {
                      'main.py': {
                        type: 'file',
                        content: 'from fastapi import FastAPI\napp = FastAPI(title="AIB-100 Service")',
                      },
                    },
                  },
                  services: {
                    type: 'dir',
                    children: {},
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function cloneFs(node: VNode): VNode {
  if (node.type === 'file') return { type: 'file', content: node.content };
  const children: Record<string, VNode> = {};
  for (const [k, v] of Object.entries(node.children)) {
    children[k] = cloneFs(v);
  }
  return { type: 'dir', children };
}

export function resolvePath(cwd: string, rawPath: string): string {
  const expanded =
    rawPath === '~' || rawPath.startsWith('~/')
      ? rawPath.replace('~', '/home/engineer')
      : rawPath;
  const combined = expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`;
  const parts = combined.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

export function getNode(root: VNode, absPath: string): VNode | null {
  if (absPath === '/') return root;
  const parts = absPath.split('/').filter(Boolean);
  let cur: VNode = root;
  for (const p of parts) {
    if (cur.type !== 'dir' || !(p in cur.children)) return null;
    cur = cur.children[p];
  }
  return cur;
}

export function areRequiredFilesPresent(root: VNode, requiredFiles: string[]): boolean {
  if (requiredFiles.length === 0) return false;
  return requiredFiles.every((f) => getNode(root, f)?.type === 'file');
}

export interface CommandResult {
  nextFs: VNode;
  nextCwd: string;
  output: string;
  isError: boolean;
  clearScreen?: boolean;
}

export const ALLOWLISTED_HELP_TEXT =
  'Safe simulated terminal (allowlisted commands only): pwd, ls [-la] [dir], cd <dir>, mkdir [-p] <dir>, touch <file>, cat <file>, echo <text>, whoami, clear, help';

export function executeTerminalCommand(
  fs: VNode,
  cwd: string,
  rawCommand: string
): CommandResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { nextFs: fs, nextCwd: cwd, output: '', isError: false };
  }

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0];
  const args = tokens.slice(1);

  if (cmd === 'clear') {
    return { nextFs: fs, nextCwd: cwd, output: '', isError: false, clearScreen: true };
  }

  let output = '';
  let isError = false;
  let nextCwd = cwd;
  const nextFs = cloneFs(fs);

  switch (cmd) {
    case 'help': {
      output = ALLOWLISTED_HELP_TEXT;
      break;
    }
    case 'whoami': {
      output = 'engineer (simulated sandbox user)';
      break;
    }
    case 'pwd': {
      output = cwd;
      break;
    }
    case 'echo': {
      output = args.join(' ').replace(/^["']|["']$/g, '');
      break;
    }
    case 'ls': {
      const showHidden = args.some((a) => a.startsWith('-') && a.includes('a'));
      const longFmt = args.some((a) => a.startsWith('-') && a.includes('l'));
      const pathArg = args.find((a) => !a.startsWith('-'));
      const targetPath = pathArg ? resolvePath(cwd, pathArg) : cwd;
      const node = getNode(nextFs, targetPath);
      if (!node) {
        output = `ls: cannot access '${pathArg}': No such file or directory`;
        isError = true;
      } else if (node.type === 'file') {
        output = pathArg ?? targetPath;
      } else {
        const entries = Object.keys(node.children)
          .filter((name) => showHidden || !name.startsWith('.'))
          .sort();
        if (longFmt) {
          const lines = showHidden ? ['drwxr-xr-x  .', 'drwxr-xr-x  ..'] : [];
          for (const name of entries) {
            const child = node.children[name];
            lines.push(`${child.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${name}`);
          }
          output = lines.join('\n') || '(empty directory)';
        } else {
          output = entries.join('  ') || '(empty)';
        }
      }
      break;
    }
    case 'cd': {
      const targetArg = args[0] ?? '~';
      const targetPath = resolvePath(cwd, targetArg);
      const node = getNode(nextFs, targetPath);
      if (!node) {
        output = `cd: ${targetArg}: No such file or directory`;
        isError = true;
      } else if (node.type !== 'dir') {
        output = `cd: ${targetArg}: Not a directory`;
        isError = true;
      } else {
        nextCwd = targetPath;
        output = `→ ${nextCwd}`;
      }
      break;
    }
    case 'mkdir': {
      const recursive = args.includes('-p');
      const dirArgs = args.filter((a) => !a.startsWith('-'));
      if (dirArgs.length === 0) {
        output = 'mkdir: missing operand';
        isError = true;
        break;
      }
      const results: string[] = [];
      for (const d of dirArgs) {
        const abs = resolvePath(cwd, d);
        const parts = abs.split('/').filter(Boolean);
        let cur: VNode = nextFs;
        let failed = false;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (cur.type !== 'dir') {
            results.push(`mkdir: cannot create directory '${d}': Not a directory`);
            isError = true;
            failed = true;
            break;
          }
          if (!(part in cur.children)) {
            if (!recursive && i < parts.length - 1) {
              results.push(`mkdir: cannot create directory '${d}': No such file or directory (try -p)`);
              isError = true;
              failed = true;
              break;
            }
            cur.children[part] = { type: 'dir', children: {} };
          }
          cur = cur.children[part];
        }
        if (!failed) results.push(`created ${abs}`);
      }
      output = results.join('\n');
      break;
    }
    case 'touch': {
      const fileArgs = args.filter((a) => !a.startsWith('-'));
      if (fileArgs.length === 0) {
        output = 'touch: missing file operand';
        isError = true;
        break;
      }
      const msgs: string[] = [];
      for (const f of fileArgs) {
        const abs = resolvePath(cwd, f);
        const parts = abs.split('/').filter(Boolean);
        const fileName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = getNode(nextFs, parentPath);
        if (!parent || parent.type !== 'dir' || !fileName) {
          msgs.push(`touch: cannot touch '${f}': No such parent directory`);
          isError = true;
        } else {
          if (!(fileName in parent.children)) {
            parent.children[fileName] = { type: 'file', content: '' };
          }
          msgs.push(`touched ${abs}`);
        }
      }
      output = msgs.join('\n');
      break;
    }
    case 'cat': {
      const target = args[0];
      if (!target) {
        output = 'cat: missing file operand';
        isError = true;
        break;
      }
      const abs = resolvePath(cwd, target);
      const node = getNode(nextFs, abs);
      if (!node) {
        output = `cat: ${target}: No such file or directory`;
        isError = true;
      } else if (node.type === 'dir') {
        output = `cat: ${target}: Is a directory`;
        isError = true;
      } else {
        output = node.content || '(empty file)';
      }
      break;
    }
    default: {
      output = `Command '${cmd}' is not in the safe simulator allowlist. Type 'help' to view supported commands.`;
      isError = true;
    }
  }

  return { nextFs, nextCwd, output, isError };
}
