var natural = require('natural');
var classifier;
var filesystem = require("fs");
var stemmer = require('stemmer');
var count = 0;

var _getAllFilesFromFolder = function (dir, classification) {


    var results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
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

var trainOnNewData = function (callback) {
    classifier = new natural.BayesClassifier();
    console.time('bayes');
    _getAllFilesFromFolder(__dirname + "/../1998/03", 'spam');
    _getAllFilesFromFolder(__dirname + "/../not_spam", 'not_spam');
    console.timeEnd('bayes');

    console.log("Starting to train on new data...");
    //classifier.events.on('trainedWithDocument', function (obj) {
    //    console.log(obj.index + 1 + '/' + obj.total);
    //});

    classifier.train();


    classifier.save('classifier.json', function (err, res) {
        callback()
    });
};

var loadExistingData = function (callback) {
    natural.BayesClassifier.load('classifier.json', stemmer, function (err, res) {
        classifier = res;
        callback();
    });
};

var checkNewMail = function (file) {
    console.log(classifier.classify(filesystem.readFileSync(file).toString('utf8')));
};

var showClassifier = function () {
    console.log('Training ended');
    console.log('################################');
    //console.log(JSON.stringify(classifier, null, 2));
};

var checkTrainError = function (dir, classification) {
    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
        var stat = filesystem.statSync(file);
        if (stat && stat.isDirectory()) {
        } else {
            var content = filesystem.readFileSync(file);
            if (classifier.classify(content.toString('utf8')) === classification) {
                count++;
            }
        }

    });
};

trainOnNewData(function () {
    showClassifier();
    //checkNewMail(__dirname + "/../not_spam/" + "00001.7c53336b37003a9286aba55d2945844c");
    //checkNewMail(__dirname + "/../1998/05/" + "894039312.15650.txt");
    console.log(classifier.getClassifications(filesystem.readFileSync(__dirname + "/../not_spam/" + "00001.7c53336b37003a9286aba55d2945844c").toString('utf8')));
    checkTrainError(__dirname + "/../1998/03", "spam");
    console.log("Spam checking .. " + count + "/39 -- " + Math.floor(count / 39 * 100) + "%");
    count = 0;
    checkTrainError(__dirname + "/../not_spam/", "not_spam");
    console.log("Not spam checking .. " + count + "/39 -- " + Math.floor(count / 39 * 100) + "%");
});

//loadExistingData(function () {
//    showClassifier();
//    checkNewMail(__dirname + "/../not_spam/" + "00001.7c53336b37003a9286aba55d2945844c");
//});


