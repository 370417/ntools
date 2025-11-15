import { homedir } from 'os';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import { WebSocketServer } from 'ws';

const attractPath = `${homedir()}/Documents/Metanet/N++/attract`;

const numAttracts = 1;

const attractFileNames = await fs.readdir(attractPath);
// attractStats: [fileName, Stats][]
const attractStats = await Promise.all(attractFileNames.map(async file => [file, await fs.stat(`${attractPath}/${file}`)]));
// sort decreasing
attractStats.sort(([_fileA, statsA], [_fileB, statsB]) => statsB.mtimeMs - statsA.mtimeMs);

console.log(attractStats[0][1].mtime);
console.log(attractStats.at(-1)[1].mtime);

attractStats.splice(numAttracts);
// stores the numAttracts latest attract files, newest first
const latestAttracts = await Promise.all(attractStats.map(([file]) => fs.readFile(`${attractPath}/${file}`)));

const wss = new WebSocketServer({ port: 8080 });

let connections = [];

wss.on('connection', ws => {
    // send attracts in backwards order so that the newest one arrives last
    for (let i = latestAttracts.length - 1; i >= 0; i--) {
        ws.send(latestAttracts[i]);
    }

    connections.push(new WeakRef(ws));
});

chokidar.watch(attractPath, { ignoreInitial: true })
    .on('add', onNewAttract)
    .on('change', onNewAttract);

function onNewAttract(path, stats) {
    console.log('detected change on path', path, 'with stats', stats.mtime);
    fs.readFile(path).then(buffer => {
        latestAttracts.unshift(buffer);
        latestAttracts.splice(numAttracts);
        connections.forEach(weakWs => {
            const ws = weakWs.deref();
            if (ws && ws.readyState === ws.OPEN) {
                ws.send(buffer);
            }
        });
        // filter out references which have been garbage collected
        connections = connections.filter(weakWs => weakWs.deref());
    });
}
