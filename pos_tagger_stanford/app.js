var StanfordSimpleNlp = require('stanford-simple-nlp').StanfordSimpleNLP;
var request = require('request');
var cheerio = require('cheerio');

var url = "http://thor.info.uaic.ro/~ciortuz/teaching.html";

var stanfordSimpleNLP = new StanfordSimpleNlp(function (err) {
    if (err) {
        return console.log(err)
    }
    request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);

            var content = $('body').text().split('\n');

            content.forEach(function (piece) {
                stanfordSimpleNLP.process(piece, function (err, result) {
                    if (err || !result) {
                        return;
                    }
                    try {
                        var sentences = result.document.sentences.sentence;
                        if (Array.isArray(sentences)) {
                            sentences.forEach(function (sentence) {
                                var tokens = sentence.tokens.token;

                                if (Array.isArray(tokens)) {
                                    tokens.forEach(function (token) {
                                        if (token.POS == 'NNP' || token.POS == 'NNPS') {
                                            console.log(token.word);
                                        }
                                    });
                                } else {
                                    if (token.POS == 'NNP' || token.POS == 'NNPS') {
                                        console.log(token.word);
                                    }
                                }
                            })
                        } else {
                            var tokens = sentences.tokens.token;

                            tokens.forEach(function (token) {
                                if (token.POS == 'NNP' || token.POS == 'NNPS') {
                                    console.log(token.word);
                                }
                            });
                        }
                    } catch (err) {

                    }
                });
            })
        }
        else {
            console.log("We’ve encountered an error: " + error);
        }
    });
});
