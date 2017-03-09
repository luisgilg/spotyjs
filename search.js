const utils = require('./utils');
const request = require('request');
const querystring = require('querystring');
const async = require('async');

const API_KEY = 'AIzaSyDx9X5D7yZvIVH6tnGB0TaJbQs8h1FYpoc';

module.exports={
    search_all:function (done) {
        var self = this;
        var done = done || ((err)=>{if (err) return console.log(err) });


        utils.get_spoty_temp_file(function(err, tracks){
            if(err) return done(err);
            var user_friendly = [];

            async.each(tracks,
            (track, cbdone)=>{
                 self.search_youtube(track, (err,ytrack,result)=>{
                    if(err) return console.log(err);                    
                    if(!ytrack || !result) return;

                    var u_track = {
                        id:ytrack.path,
                        name:ytrack.secondary_title + ' - ' + ytrack.primary_title,
                        youtube:[]
                    };

                    for (var index = 0; index < result.items.length; index++) {
                        var element = result.items[index];
                        if(!element.id || !element.id.videoId) continue;
                        
                        element.watchUrl = 'https://www.youtube.com/watch?v=' + element.id.videoId;
                        u_track.youtube.push({
                            id:element.id.videoId,
                            title:element.snippet.title,
                            url:element.watchUrl,
                            download:0
                        });
                    }

                    ytrack.youtube_search_result = result;

                    user_friendly.push(u_track);
                    cbdone(null,ytrack);                    
                })
            },
            (err)=>{
                if (err) return done(err);
                var sts = JSON.stringify(tracks,null,2);
                console.log(sts);
                utils.set_spoty_temp_file(tracks, ()=>{
                    utils.set_yt_file(user_friendly, done)
                })
                
            });
           
        })
    },
    search_youtube:function(track, done){
        var self = this;
        var done = done || ((err)=>{if (err) return console.log(err) });

        var params = {
            maxResults:10,
            order:'relevance',
            part:'id,snippet',
            q:track.full_name,
            safeSearch:'strict',
            key:API_KEY
        }

        var uri = 'https://www.googleapis.com/youtube/v3/search?' +  querystring.stringify(params);

        request.get(uri,(err,res,body)=>{
            if (err) return console.log(err);
            if (!body) return done(null,null);

            done(null,track,JSON.parse(body));
        });
    },

}