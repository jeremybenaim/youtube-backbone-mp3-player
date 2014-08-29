var express = require('express'),
    router = express.Router();

var request = require('request'),
    youtubedl = require('youtube-dl'),
    fs = require('fs'),
    child_process = require('child_process');

router.get('/', function(req, res) {
  res.render('index', {
    tracks: fs.readFileSync('tracks.json', {encoding: 'utf-8'})
  });
});

router.get('/yt/:youtube_video_id.mp3', function(req, res) {

  /* 1 month cache */
  /*res.setHeader("Cache-Control", "public, max-age=2592000");
  res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());*/
  
  var url = 'http://www.youtube.com/watch?v=' + req.params.youtube_video_id;

  youtubedl.getInfo(url, [], function(err, data) {
    if (err) {
      return res.send(500);
    }

    res.setHeader('Accept-Ranges','bytes');
    res.setHeader('Content-Type', 'audio/mp3');

    var ffmpeg_child = child_process.spawn("ffmpeg", ['-i', 'pipe:0', '-acodec', 'libmp3lame', '-f', 'mp3', '-']);

    request.get(data.url, {headers: {'Youtubedl-no-compression': 'True'}}).pipe(ffmpeg_child.stdin);

    ffmpeg_child.stdout.pipe(res);
  });

});

module.exports = router;
