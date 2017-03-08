const commandLineCommands = require('command-line-commands') 
const parser_cb = require("./spotify-cb");
const searcher = require("./search");

const downloader = require("./download");

const async = require('async')
const validCommands = [ 'parse-cb', 'search-all', 'download-all' ]

const { command, argv } = commandLineCommands(validCommands)

switch (command){
    case "parse-cb":{
        let parser =  parser_cb();
        var result = parser.process_cb((err, tracks)=>{
            console.log(tracks);
        });
        break;
    }
    case "search-all":{
        searcher.search_all();
        break;
    }
    case "download-all":{
        downloader.download_all();
        break;
    }
    
    default:{
        console.error("Command not recognised: " + command);
        break;
    } 
}

