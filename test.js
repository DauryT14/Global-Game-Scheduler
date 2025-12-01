import data from './data.json' assert {type: 'json'};
import {getOffset, getTZIdentifier} from './tools.js'

var person = data

console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log(Date.UTC())

console.log(getOffset())

import { UnionFind } from './tools.js';

let uf = new UnionFind(10);

uf.union(1, 2);
uf.union(2, 3);
uf.union(5, 6);

console.log("1 and 3 connected? ", uf.find(1) === uf.find(3));
console.log("1 and 5 connected? ", uf.find(1) === uf.find(5));

console.log("Parents:", uf.parent);
