const commandLineCommands = require('command-line-commands') 
const parser_cb = require("./spotify-cb");
const searcher = require("./search");
const downloader = require("./download");
const fixer = require("./fix-tags");
const async = require('async')

const validCommands = [ 'parse-cb', 'search-all', 'download-all', 'fix-tags' ]

const { command, argv } = commandLineCommands(validCommands)

switch (command){
    case validCommands[0]:{
        let parser =  parser_cb();
        var result = parser.process_cb((err, tracks)=>{
            console.log(tracks);
        });

        break;
    }
    case validCommands[1]:{
        searcher.search_all();

        break;
    }
    case validCommands[2]:{
        downloader.download_all();

        break;
    }
    case validCommands[3]:{
        if (argv.length == 0)  break;        
        fixer.process(argv);

        break;
    }
    
    default:{
        console.error("Command not recognised: " + command);
        break;
    } 
}

