var weka = require('./../node_modules/node-weka-master/lib/weka-lib');
var arff = require('node-arff');

arff.load('D:\\Faculta\\AN3\\ai-algorithms\\src\\training.arff', function(err, data) {
    if (err) {
        return console.error(err);
    }

    var options = {
        //'classifier': 'weka.classifiers.bayes.NaiveBayes',
        'classifier': 'weka.classifiers.functions.SMO',
        'params'    : ''
    };

    var testData = {
        outlook    : 'sunny',
        windy      : 'TRUE',
        temperature: 30,
        humidity   : 2,
        play       : 'no' // last is class attribute
    };

    weka.classify(data, testData, options, function (err, result) {

        console.log(result); //{ predicted: 'yes', prediction: '1' }

    });

});

