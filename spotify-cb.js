const async = require('async')
const ncp = require("copy-paste")
const request = require('request')
const url = require('url')
const cheerio = require('cheerio')
const utils = require('./utils');

module.exports = (argv)=>{
    var controller = {
        tracks:[],
        process_cb:function(done){
            var self = this;
            var done = done || ((err)=>{if (err) return console.log(err) });

            return ncp.paste((err, content)=>{
                if(err) return console.log("error getting the clipboard data");
                return self.process(content, done);
            })
        },
        process:function(content, done){
            var self = this;            
            var done = done || ((err)=>{if (err) return console.log(err) });
            self.tracks = self.track || [];
                                    
            if(!content) return confirm.log("error not content");
            var lines = content.split("\n");
            if (lines.length == 0) return console.log("error invalid content");
            console.log("'" + lines.length + "' content to process");

            async.each(lines,
            (line, cbdone)=>{

                let rUrl = line.replace("https://open.spotify.com","https://play.spotify.com");
                let srv = url.parse(rUrl);                
                srv.headers = {
                    "Accept":"text/html,application/xhtml+xml,application/xml;",                    
                    "Accept-Language":"es,en-US",
                    "Cache-Control":"max-age=0",
                    "Connection":"keep-alive",
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                };

                srv.uri = srv.href;
                srv.original = line;

                request.get(srv, function(err, res, body){
                    if (err) return cbdone(null);                    
                    return self.parseHTML(srv, self.tracks, body, cbdone);                    
                });                
            },
            (err)=>{
                if (err) return done(err);                                
                //console.log(self.tracks);
                return self.saveTemp(done);
            })
        },
        parseHTML: function(srv, tracks, body, done){
            var self = this;
            var done = done || ((err)=>{if (err) return console.log(err) });
                                                
            let $body = cheerio.load(body)
            let p_title =  $body('.primary-title').text();
            let s_title =  $body('.secondary-title').text();
            let cover_img =  $body('#cover-img')

            var track = {
                cover_image : cover_img.attr('src'),
                full_name : cover_img.attr('alt'),
                primary_title : p_title,
                secondary_title : s_title,
                path : srv.path,
                uri : srv.uri,
                href : srv.original,
                host : srv.host
            };

            tracks.push(track)        
            return done(null, track)
        },
        saveTemp:function(done){
            var self = this
            var done = done || ((err)=>{if (err) return console.log(err) })
            return utils.set_spoty_temp_file(self.tracks, done)
        }
    }

    return controller;
}


