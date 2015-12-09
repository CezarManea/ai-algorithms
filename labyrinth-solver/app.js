var fs = require('fs');

var max = {};


initialize([]);


function initialize(maze) {
    var fileContents = fs.readFileSync('./input.txt', {encoding: 'utf8'});
    fileContents = fileContents.split('\n');
    max = {
        lines: fileContents[0].split(' ')[0],
        col: fileContents[0].split(' ')[1]
    };

    for (var i=1;i<=max.lines;i++) {
        maze.push(fileContents[i].split(' '));
    }

    initBorders(maze);

    console.log(maze);
    escape(maze);
}

function isValidTransition(maze, current, direction) {
    if(direction == 'right') {
        return maze[current.i][current.j+1] != '-1' && maze[current.i][current.j+1] != '1';
    }
    if(direction == 'up') {
        return maze[current.i-1][current.j] != '-1' && maze[current.i-1][current.j] != '1';
    }
    if(direction == 'down') {
        return maze[current.i+1][current.j] != '-1' && maze[current.i+1][current.j] != '1';
    }
    if(direction == 'left') {
        return maze[current.i][current.j-1] != '-1' && maze[current.i][current.j-1] != '1';
    }
    return false;
}

function escape(maze) {
    var current = {};
    var cont = true;
    for (var i = 1; i< max.lines && cont; i++) {
        for (var j = 1; j < max.col && cont; j++) {
            if (maze[i][j] == '1') {
                current.i = i;
                current.j = j;
                cont = false;
            }
        }
    }
    bkt(maze, current, []);
}

function bkt(maze, current, steps) {
    if (maze[current.i][current.j] == '2') {
        console.log('Iei!');
        console.log(steps);

    } else {
        var directions = ['right', 'down', 'left', 'up'];
        for (var i = 0; i < directions.length; i++) {
            if (isValidTransition(maze, current, directions[i])) {
                go(maze, current, directions[i]);
                steps.push(directions[i]);
                bkt(maze, current, steps);
                steps.pop();
                var currentClone = JSON.parse(JSON.stringify(current));
                go(maze, current, directions[(i+2)%4]);
                maze[currentClone.i][currentClone.j] = 0;
            }
        }
    }
}

function initBorders(maze) {
    maze.forEach(function(row) {
        row.push('-1');
        row.unshift('-1');
    });
    var border = [];
    for (var i=0; i<maze[0].length; i++) {
        border.push('-1');
    }
    maze.unshift(border);
    maze.push(border);
}

function go(maze, current, direction) {
    if(direction == 'right') {
        return goRight(maze, current);
    }
    if(direction == 'up') {
        return goUp(maze,current);
    }
    if(direction == 'down') {
        return goDown(maze,current);
    }
    if(direction == 'left') {
        return goLeft(maze,current);
    }
}

function goRight(maze, current) {
    maze[current.i][current.j]=1;
    current.j++;
}

function goUp(maze, current) {
    maze[current.i][current.j]=1;
    current.i--;
}

function goDown(maze, current) {
    maze[current.i][current.j]=1;
    current.i++;
}

function goLeft(maze, current) {
    maze[current.i][current.j]=1;
    current.j--;
}