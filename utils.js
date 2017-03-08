const config = require('./config')
const fs = require('fs')

module.exports={
    get_spoty_temp_file: function(done){
        var temPath = config.spoty_tracks_temp
        fs.readFile(temPath,'utf-8', function(err, stringData){
            if(err) return done(err)
            return done(null, JSON.parse(stringData))
        });
    },

    get_yt_file: function(done){
        var temPath = config.yt_tracks
        fs.readFile(temPath,'utf-8', function(err, stringData){
            if(err) return done(err)
            return done(null, JSON.parse(stringData))
        });
    },
    set_spoty_temp_file: function(data, done){
        var temPath = config.spoty_tracks_temp
        var stringData = JSON.stringify(data,null,2);
        fs.writeFile(temPath, stringData , 'utf-8', function (err) {
            if (err) return done(err)
            return done(null, data)
        });        
    },
    set_yt_file: function(data, done){
        var temPath = config.yt_tracks
        var stringData = JSON.stringify(data,null,2);
        fs.writeFile(temPath, stringData , 'utf-8', function (err) {
            if (err) return done(err)
            return done(null, data)
        });        
    }
}
