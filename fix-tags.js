const nodeID3 = require('node-id3');
//const mm = require('musicmetadata');
const fs = require('fs');
const walk = require('walk');
const path = require('path');
const notation = 
{
    'A'     : '11B',
    'Ab#'   : '4B',
    'Ab'    : '4B',
    'G#'    : '4B',
    'Am'    : '8A',
    'B'     : '1B',
    'Bb'    : '6B',
    'Bbm'   : '3A',
    'A#m'   : '3A',
    'Bm'    : '10A',
    'C'     : '8B',
    'C#m'   : '12A',
    'Dbm'   : '12A',
    'Cm'    : '5A',
    'D'     : '10B',
    'Db'    : '3B',
    'Dm'    : '7A',
    'E'     : '12B',
    'Eb#'   : '5B',
    'D#'    : '5B',
    'D'     : '5B',
    'Ebm'   : '2A',
    'Em'    : '9A',
    'F'     : '7B',
    'F#m'   : '11A',
    'Fm'    : '4A',
    'G'     : '9B',
    'G#m'   : '1A',
    'Abm'   : '1A',
    'Gb'    : '2B',
    'F#'    : '2B',
    'Gm'    : '6A',
}


module.exports = {
    process:function(argv){
        var self = this;

        var inputPath = argv[0];

        walker = walk.walk(inputPath);

        walker.on("file", function (root, fileStats, next) {
            var trackPath = path.join(root, fileStats.name);
            var read = nodeID3.read(trackPath);
            var merge = ['title', 'artist', 'remixArtist','publisher', 'year', 'initialKey', 'originalArtist', 'genre', 'bpm', 'comments' ];
            
            var data = {};
            
            self.updateTags(data,read, merge);

            console.log('track metadata');
            console.log(data);
            
            var parsed = self.readFileName(fileStats.name);
            if (data.title) parsed.title = null;
            if (data.artist) parsed.artist = null;
            if (data.initialKey) parsed.initialKey = (notation[data.initialKey] || data.initialKey);

            self.updateTags(data, parsed, merge);
            console.log('updated metadata');
            console.log(data);
            nodeID3.write(data,trackPath);
            next();
        });
    },
    updateTags:function(data, read, merge){

        merge.forEach(function(element) {
            var source = read[element];                
            if (source)
                data[element] = read[element];

        }, this);
    },
    readFileName:function(fileName){

        //var parts = fileName.split('-');
        var part00 = fileName.substring(0,fileName.lastIndexOf('-'));
        var part1 = fileName.substring(fileName.lastIndexOf('-')+1 , fileName.length);

        var part1_1 = part1.split('.');
        var part1_1_0 = part1_1[0].trim();
        var title = null ;
        var trackArtist = part00;
        var remixArtist = null;

        if (part1_1_0.indexOf("(")>-1){
            title = part1_1_0.substring(0,part1_1_0.lastIndexOf("(")).trim();
            var mixPart = part1_1_0.substring(part1_1_0.lastIndexOf("(")+1, part1_1_0.lastIndexOf(")")).trim();

            if  (mixPart.toLowerCase().indexOf("remix")>-1){
                remixArtist = mixPart.substring(0,mixPart.toLowerCase().indexOf("remix")).trim();
            }
        }else{
            title = part1_1_0;
        }

        return{
            title:title,
            artist:trackArtist,
            remixArtist:remixArtist,
        }
    }    
}
