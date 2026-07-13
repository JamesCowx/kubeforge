import { useState, useRef, useEffect } from 'react';

export default function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([
    '\x1b[36mKubeForge Terminal v3.1.0\x1b[0m | \x1b[90mType "help" for commands\x1b[0m',
    '',
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cwd, setCwd] = useState('/home/jamescowx/projects/kubeforge');

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const commands: Record<string, (args: string[]) => [string[], string]> = {
    help: () => [[
      '\x1b[1mAvailable commands:\x1b[0m',
      '  \x1b[36mhelp\x1b[0m      Show this message',
      '  \x1b[36mls\x1b[0m        List directory contents',
      '  \x1b[36mcd\x1b[0m        Change directory',
      '  \x1b[36mpwd\x1b[0m       Print working directory',
      '  \x1b[36mcat\x1b[0m       View file contents',
      '  \x1b[36mdocker\x1b[0m    List containers',
      '  \x1b[36mkubectl\x1b[0m   Get cluster pods',
      '  \x1b[36mnmap\x1b[0m      Network scan',
      '  \x1b[36mping\x1b[0m      Test connectivity',
      '  \x1b[36mdf\x1b[0m        Disk usage',
      '  \x1b[36muptime\x1b[0m    System uptime',
      '  \x1b[36mclear\x1b[0m     Clear terminal', 
      '  \x1b[36mwhoami\x1b[0m    Current user',
    ], cwd],
    about: () => [['KubeForge Terminal v3.1.0 | Kubernetes Cluster Manager | Node.js 22 | Linux 6.8'], cwd],
    pwd: () => [[cwd], cwd],
    whoami: () => [['root'], cwd],
    date: () => [[new Date().toString()], cwd],
    clear: () => [[], cwd],
    df: () => [['\x1b[1mFilesystem\x1b[0m      Size    Used   Avail  Use%', '/dev/sda1       250G    145G    105G   58%', '/dev/sdb1       500G    320G    180G   64%'], cwd],
    uptime: () => [[` \x1b[32m${randomInt(1, 30)}:${String(randomInt(0, 59)).padStart(2, '0')}\x1b[0m up \x1b[32m${randomInt(5, 120)} days\x1b[0m, ${randomInt(0, 24)}:${String(randomInt(0, 59)).padStart(2, '0')}, 3 users, load avg: ${(Math.random() * 2).toFixed(2)}`], cwd],
    docker: () => [['\x1b[1mCONTAINER ID   IMAGE          STATUS          PORTS\x1b[0m', '\x1b[32mabc123def456\x1b[0m   nginx:latest   \x1b[32mUp 3 hours\x1b[0m     0.0.0.0:80->80/tcp', 'def456abc789   redis:7        \x1b[32mUp 2 days\x1b[0m      0.0.0.0:6379->6379/tcp', '\x1b[33mghi789jkl012\x1b[0m   postgres:16    \x1b[33mUp 5 days\x1b[0m      0.0.0.0:5432->5432/tcp'], cwd],
    kubectl: () => [['\x1b[1mNAME                      READY   STATUS    RESTARTS   AGE\x1b[0m', '\x1b[32mapi-deployment-7d5f\x1b[0m      3/3     \x1b[32mRunning\x1b[0m   0          2d', '\x1b[32mworker-deployment-6c4\x1b[0m    5/5     \x1b[32mRunning\x1b[0m   1          2d', '\x1b[33mredis-statefulset-0\x1b[0m      1/1     \x1b[33mRunning\x1b[0m   0          5d'], cwd],
    ping: (args) => {
      const target = args[0] || 'google.com';
      return [[`PING ${target} (142.250.80.46): 56 data bytes`, '64 bytes from 142.250.80.46: icmp_seq=0 ttl=118 time=\x1b[32m12.3\x1b[0m ms', '64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=\x1b[32m11.7\x1b[0m ms', '64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=\x1b[32m13.1\x1b[0m ms', '', '--- google.com ping statistics ---', '3 packets transmitted, \x1b[32m3 received\x1b[0m, 0% packet loss'], cwd];
    },
    nmap: (args) => [[`Starting Nmap scan on ${args[0] || 'localhost'}...`, '', '\x1b[1mPORT     STATE    SERVICE\x1b[0m', '\x1b[32m22/tcp   open\x1b[0m     ssh', '\x1b[32m80/tcp   open\x1b[0m     http', '\x1b[32m443/tcp  open\x1b[0m     https', '\x1b[32m3000/tcp open\x1b[0m     node', '\x1b[32m5432/tcp open\x1b[0m     postgresql', '\x1b[33m6379/tcp open\x1b[0m     redis', '\x1b[90m8080/tcp closed\x1b[0m   proxy', '', 'Nmap done: 1 IP scanned in 2.34s'], cwd],
    ls: () => {
      const files = ['\x1b[34mnode_modules/\x1b[0m', '\x1b[34mdist/\x1b[0m', '\x1b[34msrc/\x1b[0m', '\x1b[34mdeploy/\x1b[0m', '\x1b[90mDockerfile\x1b[0m', '\x1b[90mpackage.json\x1b[0m', '\x1b[90mtsconfig.json\x1b[0m', '\x1b[90mvite.config.ts\x1b[0m', '\x1b[90mREADME.md\x1b[0m', '\x1b[90m.env.example\x1b[0m'];
      return [files, cwd];
    },
    cat: (args) => {
      const file = args[0];
      if (!file) return [['\x1b[33musage: cat <filename>\x1b[0m'], cwd];
      if (file === 'package.json') return [['{', '  "name": "kubeforge",', '  "version": "3.1.0",', '  "private": true,', '  "dependencies": {', '    "react": "^19.0.0",', '    "kubernetes-client": "^10.0.0"', '  }', '}'], cwd];
      return [[`\x1b[33mcat: ${file}: No such file\x1b[0m`], cwd];
    },
    cd: (args) => {
      const dir = args[0];
      if (!dir) return [[''], '/home/jamescowx'];
      if (dir === '..') {
        const parts = cwd.split('/'); parts.pop();
        return [[''], parts.join('/') || '/'];
      }
      if (dir === 'src') return [[''], `${cwd}/src`];
      return [[''], cwd];
    },
  };

  function execute(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) { setLines((prev) => [...prev, `\x1b[32mroot@kubeforge\x1b[0m:\x1b[34m${cwd}\x1b[0m$ `]); return; }
    setLines((prev) => [...prev, `\x1b[32mroot@kubeforge\x1b[0m:\x1b[34m${cwd}\x1b[0m$ \x1b[37m${trimmed}\x1b[0m`]);
    setHistory((prev) => [...prev, trimmed]); setHistoryIdx(-1);
    const [command, ...args] = trimmed.split(/\s+/);
    const handler = commands[command.toLowerCase()];
    if (handler) {
      const [result, newCwd] = handler(args);
      if (newCwd !== cwd) setCwd(newCwd);
      if (command.toLowerCase() === 'clear') setLines([]);
      else setLines((prev) => [...prev, ...result]);
    } else {
      setLines((prev) => [...prev, `\x1b[31mbash: ${command}: command not found\x1b[0m`]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { execute(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(newIdx); setInput(history[history.length - 1 - newIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx); setInput(history[history.length - 1 - newIdx] || '');
      } else { setHistoryIdx(-1); setInput(''); }
    }
  }

  const esc = String.fromCharCode(27);

  function renderLine(line: string) {
    const colorized = line
      .replace(new RegExp(esc + '\\[32m', 'g'), '<span style="color:#34d399">')
      .replace(new RegExp(esc + '\\[31m', 'g'), '<span style="color:#f87171">')
      .replace(new RegExp(esc + '\\[33m', 'g'), '<span style="color:#fbbf24">')
      .replace(new RegExp(esc + '\\[36m', 'g'), '<span style="color:#60a5fa">')
      .replace(new RegExp(esc + '\\[34m', 'g'), '<span style="color:#a78bfa">')
      .replace(new RegExp(esc + '\\[90m', 'g'), '<span style="color:#64748b">')
      .replace(new RegExp(esc + '\\[1m', 'g'), '<span style="font-weight:700">')
      .replace(new RegExp(esc + '\\[0m', 'g'), '</span>')
      .replace(new RegExp(esc + '\\[37m', 'g'), '<span style="color:#e2e8f0">');
    return <span dangerouslySetInnerHTML={{ __html: colorized }} />;
  }

  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#f87171]" />
        <span className="w-3 h-3 rounded-full bg-[#fbbf24]" />
        <span className="w-3 h-3 rounded-full bg-[#34d399]" />
        <span className="text-[11px] font-mono text-[var(--color-text-muted)] ml-2">root@kubeforge â€” bash â€” 80Ã—24</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-[var(--color-text-muted)] font-mono">connected</span>
      </div>

      <div ref={scrollRef} onClick={() => inputRef.current?.focus()}
        className="bg-[#050710] rounded-xl p-4 h-80 overflow-y-auto font-mono text-[13px] leading-relaxed border border-white/[0.04]">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">{line ? renderLine(line) : '\u00A0'}</div>
        ))}
        <div className="flex items-center">
          <span className="text-[#34d399] whitespace-nowrap">{`root@kubeforge:`}</span>
          <span className="text-[#a78bfa]">{`${cwd}`}</span>
          <span className="text-white">$&nbsp;</span>
          <input ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#e2e8f0] font-mono text-[13px] caret-[#60a5fa]"
            autoFocus />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['help', 'ls', 'ping', 'nmap', 'docker', 'kubectl', 'df', 'uptime', 'cat package.json', 'whoami', 'clear'].map((cmd) => (
          <button key={cmd} onClick={() => execute(cmd)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.02] border border-white/[0.04] text-[var(--color-text-muted)] hover:text-white hover:border-white/[0.1] transition-all cursor-pointer">
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

