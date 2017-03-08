const utils = require('./utils');
const async = require('async');
const ytdl = require('ytdl-core');
var fs = require('fs');
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
let ffmpegstatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegstatic.path);

module.exports={
    download_all:function (done) {
        var self = this;
        var done = done || ((err)=>{if (err) return console.log(err) });
        var downloadPath = path.join(__dirname,"downloads");

        utils.get_yt_file((err,links)=>{
            async.each(links,(link, cbdone)=>{

                fs.exists(downloadPath,function(exist){
                    if(!exist){
                        fs.mkdir(downloadPath, function(err){

                        })
                    }
                })

                for (var index = 0; index < link.youtube.length; index++) {
                    var element = link.youtube[index];
                    var filename = element.title + '.mp3';
                    var fullpath = path.join(downloadPath, filename).replace("|","");

                    if (element && element.download == 1) {                                    
                        self.download_yt(element.url,element.title,fullpath,()=>{});                        
                    }
                }

                cbdone(null);

            },
            (err)=>{})
        });
    },
    download_yt:function(url, title, fullpath, done){
        console.log('downloading: ' + title + '\r\n\t ' + url);

        ffmpeg()        
        .input(ytdl(url, {
            format: 'highest',
            filter: 'audioonly',
        }))
        .audioBitrate('320k')
        .toFormat('mp3')
        .save(fullpath)
        .on('end', function () {
            console.log('finished: ' + title + '\r\n\t ' + url);
            done(null);
        })
        .on('error', function (err) {
            console.error('error: ' + title + '\r\n\t ' + url);
            //done(null);
        })
         .on('progress', function(progress) {
            //console.log( title + '\r\n\t ' + url  + ' time mark ' + progress.timemark);
        });

        // ytdl(url, {
        //     format: 'highest',
        //     filter: 'audioonly',
        // })        
        // .pipe(fs.createWriteStream(fullpath))
        // .on('finish', function () {
        //     console.log('finished: ' + title + '\r\n\t ' + url);
        //     done(null);
        // })
        // .on('error', function (err) {
        //     done(null);
        // })
        
    },
    search_youtube:function(track, done){
             
    },
}