var _ = require('underscore');
var stdin = process.openStdin();
var async = require('async');

var get_move = function () {
    const moves = ['R', 'P', 'S'];
    var rand = _.random(0,2);
    return moves[rand];
};

var game_over = function(state){
    return state.bot === 10 || state.player === 10;
};

var bot_move = function(state, cb){
    state.bot_move = get_move();
    cb();
};

var player_move = function(state, cb){
    console.log("Enter move: ");
    var stdin = process.openStdin();
    stdin.addListener("data", function(d){
        state.player_move = d.toString().trim();
        stdin.removeAllListeners("data");
        cb();
    })
};

var update_score = function(state, cb){
    if (state.bot_move === 'R' && state.player_move === 'S'){
        state.bot++;
        return cb();
    }
    if (state.bot_move === 'R' && state.player_move === 'P'){
        state.player++;
        return cb();
    }
    if (state.bot_move === 'S' && state.player_move === 'R'){
        state.player++;
        return cb();
    }
    if (state.bot_move === 'S' && state.player_move === 'P'){
        state.bot++;
        return cb();
    }
    if (state.bot_move === 'P' && state.player_move === 'R'){
        state.bot++;
        return cb();
    }
    if (state.bot_move === 'P' && state.player_move === 'S'){
        state.player++;
        return cb();
    }
    cb();
};

var init_game = function(){
    return {
        bot: 0,
        player: 0,
        bot_move: null,
        player_move: null
    };
};

var play_rps = function(state){
    async.series([
        function(cb){
            bot_move(state, cb);
        },
        function(cb){
            player_move(state, cb);
        },
        function(cb){
            update_score(state, cb);
        }
    ], function(){
        console.log(state);
        if (!game_over(state)){
            return play_rps(state);
        }
        process.exit(0);
    });
};

var state = init_game();
play_rps(state);

