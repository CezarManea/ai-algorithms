var request = require('request');
var cheerio = require('cheerio');
var url = "http://thor.info.uaic.ro/~ciortuz/teaching.html";

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);

        var title = $('title').text();
        var content = $('body').text();

        var pos = require('pos');
        var words = new pos.Lexer().lex(content);
        var tagger = new pos.Tagger();
        var taggedWords = tagger.tag(words);
        for (var i in taggedWords) {
            var taggedWord = taggedWords[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];
            if (tag === "NNP" || tag === "NNPS"){
                console.log(word);
            }
        }
    }
    else {
        console.log("We’ve encountered an error: " + error);
    }
});