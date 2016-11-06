var Handlebars  = require('handlebars');
var yaml        = require('js-yaml');
var fs          = require('fs');
var exec        = require('child_process').exec;

var dest        = '../build';
var src         = './src';
var layouts     = './layouts';
var indexLayout = 'main.html';
var namaLayout  = 'nama.html';
var siteBase    = 'http://mviz.omid.al/';

var indexTemplate   = Handlebars.compile(fs.readFileSync(layouts + '/' + indexLayout, 'utf8'));
var namaTemplate    = Handlebars.compile(fs.readFileSync(layouts + '/' + namaLayout, 'utf8'));

exec('rm -rf ' + dest + '/p && mkdir -p ' + dest + '/p');
exec('cp -R assets/ ' + dest + '/assets');
// fs.mkdirSync(dest + '/p/');

var works = [];

fs.readdir(src, (err, files) => {
    // Create the pages for each work, and clone the gits
    workFiles = files.filter(file => {
        return file.substr(file.length - 5, 5) == '.yaml';
    })
    .forEach(file => {
        var fileName = file.substr(0, file.length - 5);

        var work = yaml.safeLoad(fs.readFileSync(src + '/' + file, 'utf8'));
        work.url = siteBase + 'p/' + work.gist;
        var html = namaTemplate(work);

        fs.mkdirSync(dest + '/p/' + work.gist);
        fs.writeFile(dest + '/p/' + work.gist + '/index.html', html, 'utf8');
        var cmd  = 'cd ' + dest + '/p/' + work.gist +'/';
            cmd += ' && git clone https://gist.github.com/' + work.gist + '.git raw';
            cmd += ' && cd raw && rm -rf .git/';

        exec(cmd);

        works.push(work);        
    });

    // Create the index
    var indexhtml = indexTemplate({
        'works': works
    });    
    fs.writeFile(dest + '/index.html', indexhtml, 'utf8');
});