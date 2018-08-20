function Pos(x=0, y=0) {
    this.x = x;
    this.y = y;
}

function Preview(sizeX=5, sizeY=5) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.canvas = null;
}

Preview.prototype.init = function(canvas) {

    this.canvas = canvas;

    this.clear();
}

Preview.prototype.clear = function() {

    if (this.canvas) {

        while(this.canvas.firstChild) {
            this.canvas.removeChild(this.canvas.firstChild);
        }

        this.canvas.style.width = this.sizeX + 'em';
        this.canvas.style.height = this.sizeY + 'em';

        for( let x=0; x<this.sizeX; x++) {

            for( let y=0; y<this.sizeY; y++) {
                
                let child = document.createElement('div');
                child.className = 'tile';
                child.id = `preview_${x}_${y}`;
                
                child.style.left = x + 'em';
                child.style.top = y + 'em';

                this.canvas.appendChild(child);
            }
        }
    }
}

Preview.prototype.show = function(piece) {

    if (this.canvas) {

        this.clear();

        piece.pos = new Pos(2, 2);

        var arr = piece.toTablePos();

        for (let i=0; i<arr.length; i++) {

            let itemPos = arr[i];
    
            let el = document.getElementById(`preview_${itemPos.x}_${itemPos.y}`);
    
            if (el) {
    
                if (!el.classList.contains('fake-piece')) {
    
                    el.classList.add('fake-piece');
                }
            }
        }
    }
}

function Table(sizeX=11, sizeY=15) {

    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.canvas = null;    
    this.updateID = -1;
    this.center = Math.floor(this.sizeX/2);
};

Table.prototype.init = function(node) {

    this.canvas = node;

    this.piece = null;
    
    while(this.canvas.firstChild) {
        this.canvas.removeChild(this.canvas.firstChild);
    }

    this.canvas.style.width = this.sizeX + 'em';
    this.canvas.style.height = this.sizeY + 'em';

    for( let x=0; x<this.sizeX; x++) {

        for( let y=0; y<this.sizeY; y++) {

            let child = document.createElement('div');
            child.className = 'tile';
            child.id = `_${x}_${y}`;
            
            child.style.left = x + 'em';
            child.style.top = y + 'em';

            this.canvas.appendChild(child);
        }
    }

    this.updateScore();
}

function randInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Table.prototype.createPiece = function(type) {

    let piece = new Piece(this.center, -2);

    switch (type) {

        case 0: //  I

            piece.rot.push(
                [new Pos(0, -1), new Pos(0, -2), new Pos(0, 1)],
                [new Pos(-1, 0), new Pos(-2, 0), new Pos(1, 0)]
            );           
            break;

        case 1: //  T
            
            piece.rot.push(
                [new Pos(0, 1), new Pos(0, -1), new Pos(1, 0)],
                [new Pos(-1, 0), new Pos(0, 1), new Pos(1, 0)],
                [new Pos(0, 1), new Pos(0, -1), new Pos(-1, 0)],
                [new Pos(-1, 0), new Pos(0, -1), new Pos(1, 0)]
            );        
            break;

        case 2: //  O
            
            piece.rot.push([new Pos(0, 1), new Pos(1, 1), new Pos(1, 0)]);            
            break;

        case 3: // L
            
            piece.rot.push(
                [new Pos(0, -1), new Pos(-1, 1), new Pos(0, 1)],
                [new Pos(-1, 0), new Pos(-1, -1), new Pos(1, 0)],
                [new Pos(0, -1), new Pos(1, -1), new Pos(0, 1)],
                [new Pos(-1, 0), new Pos(1, 0), new Pos(1, 1)]                
            );       
            break;

        case 4: //  ~L
            
            piece.rot.push(
                [new Pos(0, -1), new Pos(0, 1), new Pos(1, 1)],
                [new Pos(-1, 0), new Pos(-1, 1), new Pos(1, 0)],
                [new Pos(-1, -1), new Pos(0, -1), new Pos(0, 1)],
                [new Pos(-1, 0), new Pos(1, 0), new Pos(1, -1)]
            );         
            break;

        case 5: //  S
            
            piece.rot.push(
                [new Pos(-1, 0), new Pos(-1, -1), new Pos(0, 1)],
                [new Pos(-1, 0), new Pos(0, -1), new Pos(1, -1)]);
            break;            

        case 6: //  ~S
            
            piece.rot.push(
                [new Pos(0, 1), new Pos(1, 0), new Pos(1, -1)],
                [new Pos(-1, 0), new Pos(0, 1), new Pos(1, 1)]
            );
            break;
    }

    return piece;
}

Table.prototype.emitPiece = function() {
        
    let el = document.getElementById(`_${this.center}_0`);

    if (el && el.classList.contains('blocked')) {

        gameOver();

        return null;

    } else {
        
        let rand = nextPiece;

        let piece = this.createPiece(rand);

        nextPiece = randInt(0, 6);

        preview.show(table.createPiece(nextPiece));

        return piece;
    }
}

Table.prototype.deleteRows = function() {

    let rowToDel = [];

    for (let y=0; y<this.sizeY; y++) {

        let toDelete = true;

        for (let x=0; x<this.sizeX; x++) {
            
            let el = document.getElementById(`_${x}_${y}`);
            
            if (el.classList.contains('blocked') == false) {
                toDelete = false;
            }
        }

        if (toDelete == true) {

            rowToDel.push(y);
        }
    }

    for (let x=0; x<this.sizeX; x++) {

        for (let y=0; y<this.sizeY; y++) {

            if (rowToDel.indexOf(y) == -1) {

                continue;
            }                

            let el = document.getElementById(`_${x}_${y}`);

            while (el.classList.contains('blocked')) {

                el.classList.remove('blocked');
            }
        }
    }
    
    for (let x=0; x<this.sizeX; x++) {

        for (let y=this.sizeY-1; y>=0; y--) {

            let countUnder = 0;

            for (let i=0; i<rowToDel.length; i++) {
                
                if (rowToDel[i] > y) {
                    countUnder++;
                }
            }

            if (countUnder > 0) {

                let el = document.getElementById(`_${x}_${y}`);
                                                        
                let target = document.getElementById(`_${x}_${y+countUnder}`);
                
                if (target) {
                    
                    if (el.classList.contains('blocked')) {

                        el.classList.remove('blocked');

                        if (target.classList.contains('blocked') == false) {

                            target.classList.add('blocked');
                        }
                    }
                }               
            }
        }
    }

    let deletedRows = rowToDel.length;

    gameScore += deletedRows * deletedRows * rowScore;
}

Table.prototype.checkMove = function(dirX, dirY) {
    
    let arr = this.piece.toTablePos(dirX, dirY);

    for (let i=0; i<arr.length; i++) {

        let itemPos = arr[i];

        if (itemPos.x < 0 || itemPos.x >= this.sizeX || itemPos.y >= this.sizeY) {
            return false;
        }

        let el = document.getElementById(`_${itemPos.x}_${itemPos.y}`);

        if (el) {

            if (el.classList.contains('blocked')) {

                return false;
            }
        }
    }

    return true;
}

Table.prototype.checkRotation = function(dir) {

    if (!this.piece) {
        
        return false;
    }

    let arr = this.piece.toTableRot(this.piece.currentRot + dir);
    
    for (let i=0; i<arr.length; i++) {

        let itemPos = arr[i];

        if (itemPos.x < 0 || itemPos.x >= this.sizeX || itemPos.y >= this.sizeY) {
            return false;
        }

        let el = document.getElementById(`_${itemPos.x}_${itemPos.y}`);

        if (el) {

            if (el.classList.contains('blocked')) {

                return false;
            }
        }
    }

    return true;
        
}

Table.prototype.redraw = function() {


    let piecesArr = document.getElementsByClassName('piece');

    do {

        for (let i=0; i<piecesArr.length; i++) {

            piecesArr[i].classList.remove('piece');
        }

        piecesArr = document.getElementsByClassName('piece');

    } while(piecesArr.length)

    if (this.piece) {
        
        this.piece.draw();
    }
}

Table.prototype.update = function() {

    if (this.piece) {

        this.piece.update(this);
    }

    this.updateScore();
}

Table.prototype.keyDown = function(keyCode) {

    let piece = this.piece;

    if (!piece) {
        
        return;
    }
    
    if (keyCode == 37) {    //  left arrow

        if (this.checkMove(-1, 0)) {
            this.piece.pos.x--;
        }   

    } else if (keyCode == 39) { //  left arrow

        if (this.checkMove(1, 0)) {
            this.piece.pos.x++;
        }

    } else if (keyCode == 38) { //  up arrow
        
        if (this.checkRotation(+1)) {

            this.piece.Rot(+1);
        }

    } else if (keyCode == 40) { //  down arrow

        if (this.checkMove(0, 1)) {

            this.piece.pos.y++;
        }

    } else if (keyCode == 82) {//  'R'
        
        RESET(this.canvas);
    }
    
    this.redraw();
}

function formatNumber(num) {

    let outStr = num.toFixed();

    if (num > 999999) {

        outStr = (num / 1000000).toFixed(2) + 'M';

    } else if (num > 9999) {

        outStr = (num / 10000).toFixed(1) + 'k';
    }

    return outStr;
}

Table.prototype.updateScore = function() {

    let el = document.getElementById('game-score');

    el.innerText = formatNumber(gameScore);
}

function Piece(x, y) {
    
    this.pos = new Pos(x, y);

    this.rot = [];
    this.currentRot = 0;
}

Piece.prototype.Rot = function(dir) {

    this.currentRot  += dir;

    if (this.currentRot < 0) {

        this.currentRot = this.rot.length-1;
    }

    if (this.currentRot >= this.rot.length) {

        this.currentRot = 0;
    }
}

Piece.prototype.toTablePos = function(dirX=0, dirY=0) {

    let out = [new Pos(this.pos.x + (dirX != 0 ? dirX : 0), this.pos.y + (dirY != 0 ? dirY : 0))];

    if (this.rot && this.rot.length) {

        for (let i=0; i<this.rot[this.currentRot].length; i++) {

            let itemPos = this.rot[this.currentRot][i];
            
            out.push(new Pos(this.pos.x + (itemPos.x + (dirX != 0 ? dirX : 0)), this.pos.y + (itemPos.y + (dirY != 0 ? dirY : 0))));
        }
    }

    return out;
}

Piece.prototype.toTableRot = function(dir=0) {

    let out = [new Pos(this.pos.x, this.pos.y)];

    if (this.rot && this.rot.length) {

        if (dir < 0 ) {

            dir = this.rot.length-1;
        }
        
        if (dir >= this.rot.length ) {
    
            dir = 0;
        }
                
        for (let i=0; i<this.rot[dir].length; i++) {

            let itemPos = this.rot[dir][i];
            
            out.push(new Pos(this.pos.x + itemPos.x, this.pos.y + itemPos.y ));
        }
    }

    return out;
}

Piece.prototype.draw = function() {

    let arr = this.toTablePos();
    
    for (let i=0; i<arr.length; i++) {

        let itemPos = arr[i];

        let el = document.getElementById(`_${itemPos.x}_${itemPos.y}`);

        if (el) {

            if (!el.classList.contains('piece')) {

                el.classList.add('piece');
            }
        }
    }
}

Piece.prototype.update = function(table) {

    if (!table.checkMove(0, 1)) {
        
        let arr = this.toTablePos();

        for (let i=0; i<arr.length; i++) {
            
            let itemPos = arr[i];
            
            let el = document.getElementById(`_${itemPos.x}_${itemPos.y}`);
    
            if (el) {
    
                if (!el.classList.contains('blocked')) {

                    el.classList.add('blocked');
                }
            }
        }

        table.piece = table.emitPiece();


    } else {

        this.pos.y++;
    }

    table.deleteRows();

    table.redraw();
}




let gameScore = 0;

let rowScore = 100;

let table = null;

let preview = null;

let gameLevel = [600, 300, 150];

let gameSpeed = gameLevel[0];

let nextPiece = 3;

function gameoverToMenu() {

    let el = document.getElementById('game-over-frame');

    if (el) {

        el.style.visibility = 'hidden';

        let menuFrame = document.getElementById('game-menu-frame');

        menuFrame.style.visibility = 'visible';        
    }
}

function gameoverRetry() {

    let el = document.getElementById('game-over-frame');
            
    if (el) {
        
        el.style.visibility = 'hidden';

        RESET(table.canvas);
    }
}

function gameOver() {

    clearInterval(table.updateID);

    table.updateID = -1;

    let el = document.getElementById('game-over-frame');
            
    if (el) {

        el.style.visibility = 'visible';

        let scoreEl = document.getElementById('game-over-score');

        scoreEl.innerText = gameScore;
    }
}

function menuToGame(level) {

    setGameLevel(level);

    let menuFrame = document.getElementById('game-menu-frame');

    menuFrame.style.visibility = 'hidden';

    RESET(table.canvas);    
}

function setGameLevel(level) {

    if (level < 0) {

        level = 0;

    } else if (level > gameLevel.length-1) {

        level = gameLevel.length-1;
    }

    gameSpeed = gameLevel[level];

}


function INIT() {

    table = new Table(10, 16);
    
    let canvas = document.getElementById('table');

    document.addEventListener('keydown', function(e) {

        if (table) {

            table.keyDown(e.keyCode);
        }
    });
    
    table.init(canvas);

    preview = new Preview();

    preview.init(document.getElementById('piece-preview'));
}

function gameLoop() {

    table.update();

    table.redraw();
}

function RESET(canvas) {

    gameScore = 0;

    preview.clear();

    table.init(canvas);
    
    table.piece = table.emitPiece();
    
    table.redraw();
    
    if (table.updateID) {

        clearInterval(table.updateID);

        table.updateID = -1;
    }

    table.updateID = setInterval(gameLoop, gameSpeed);
}
