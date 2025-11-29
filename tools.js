function getOffset(){
    var offset = new Date().getTimezoneOffset();
    var offsetHour = offset/60;
    return offsetHour
}

function convertToMatrix(person, hours){

}

class UnionFind {
    constructor(n) {
        this.parent = new Array(n).fill(0).map((_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);

        if (rootA !== rootB) {
            if (this.rank[rootA] < this.rank[rootB]) {
                this.parent[rootA] = rootB;
            } else if (this.rank[rootA] > this.rank[rootB]) {
                this.parent[rootB] = rootA;
            } else {
                this.parent[rootB] = rootA;
                this.rank[rootA]++;
            }
        }
    }
}

export {getOffset, convertToMatrix, UnionFind};