var weka = require('node-weka');
var arff = require('node-arff');

arff.load('training.arff', function (err, data) {
    if (err) {
        return console.error(err);
    }

    var options = {
        'classifier': 'weka.classifiers.trees.Id3',
        'params': ''
    };

    var testData = {
        buying: 'high',
        maint: 'high',
        doors: '2',
        persons: 'more',
        lug_boot: 'big',
        safety: 'med',
        class: 'good'
    };

    weka.classify(data, testData, options, function (err, result) {

        console.log(result);

    });

});

