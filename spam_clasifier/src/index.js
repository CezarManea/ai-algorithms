var natural = require('natural');
var classifier;
var filesystem = require("fs");
var stemmer = require('stemmer');

var _getAllFilesFromFolder = function(dir, classification) {


    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else {
            var content = filesystem.readFileSync(file);
            classifier.addDocument(content.toString('utf8'), classification);
        }

    });

    return results;

};

var trainOnNewData = function(callback){
    classifier = new natural.BayesClassifier();

    _getAllFilesFromFolder(__dirname + "/../1998/03", 'spam');

    console.log("Starting to train on new data...");
    classifier.events.on('trainedWithDocument', function (obj) {
        console.log(obj.index+1 + '/' + obj.total);
    });
    classifier.train();



    classifier.save('classifier.json', function(err, res) {
        callback()
    });
};

var loadExistingData = function(callback){
    natural.BayesClassifier.load('classifier.json', stemmer, function(err, res) {
        classifier = res;
        callback();
    });
};

var showClassifier = function(){
    console.log('Training ended');
    console.log('################################');
    console.log(JSON.stringify(classifier, null, 2));
};

trainOnNewData(showClassifier);
//loadExistingData(showClassifier);


