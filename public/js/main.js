;(function() {
  "use strict";

  var JB = new Marionette.Application();

  _.extend(JB, Backbone.Events);

  _.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
  };

  JB.TrackModel = Backbone.Model.extend({
    defaults : {
      'id': '',
      'title': ''
    }
  });

  JB.SingleTrackView = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#trackTemplate',
    events: {
      'click': 'broadcastClick'
    },
    broadcastClick: function (e) {
      if (e.target.nodeName.toLowerCase() === 'img'){
        this.$el.addClass('current')
          .siblings().removeClass('current');

        JB.trigger('track:click', this.model.toJSON());
      }
    }
  });

  JB.PlayList = Backbone.Collection.extend({
    model: JB.TrackModel
  });

  JB.PlayListView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    childView: JB.SingleTrackView
  });

  JB.PlayerModel = Backbone.Model.extend({
    defaults : {
      'id': '',
      'title': 'nothing to play :(',
      'state': 'paused'
    }
  });

  JB.Player = Backbone.Marionette.CompositeView.extend({
    template: '#playerTemplate',
    model: new JB.PlayerModel(),
    events: {
      'click': 'togglePlayPause'
    },
    initialize: function () {
      var self = this;
      
      /* Player is paused by default */
      this.$el.addClass('paused');

      /* Bind Events */
      JB.on('track:click', function(model){
        if (self.model.id === model.id) {
          self.togglePlayPause();
        } else { 
          self.$el.find('h1 .timer').text('');
          self.$el.find('h1 .title').text('Loading...');
          self.playTrack(model);
        }
      });
      JB.on('keyboard:spacebar', function() {
        self.togglePlayPause();
      });
      JB.on('player:play', function(data){
        self.model.set('id', data.id);
        self.model.set('title', data.title);
        self.model.set('state', 'playing');
        console.log('♫ start playing track: "'+ data.title+ '" ♫');
      });
    },
    togglePlayPause: function(){
      var audio = $('audio')[0] || null;

      if (!audio) return;

      if (audio.paused) {
        window.utils.audio.smoothPlay(audio, 400);
      } else {
        window.utils.audio.smoothPause(audio, 200);
      }
      $('.player').toggleClass('paused playing');
    },
    playTrack: function (model) {
      var self = this;

      var $audio = this.findOrCreateAudioElement(),
          audio = $audio.context,
          url = 'http://localhost:3000/yt/'+model.id+'.mp3';

      /* Clear previous event listener */
      $audio.off('canplay', play);
      $audio.off('timeupdate', updateTimer);

      /* Set mp3 url to start loading it */
      audio.autoplay = true;
      audio.src = url;
      
      var play = function () {
        self.$el.find('h1 .title').text(model.title);
        self.$el.addClass('playing').removeClass('paused');
        JB.trigger('player:play', model);
      };
      var updateTimer = function () {
        var minutes = Math.round(audio.currentTime/60),
            seconds = Math.round(audio.currentTime%60);

        var timer = (minutes<10 ? '0' + minutes : minutes) + ':' + (seconds<10 ? '0' + seconds : seconds);
        
        self.$el.find('h1 .timer').text('[' + timer + ']');
      };

      $audio.on('canplay', play);
      $audio.on('timeupdate', updateTimer);
    },
    findOrCreateAudioElement: function () {
      var audioElm = this.$el.find('audio');

      if (audioElm.length > 0) {

        console.log('audio element found');
        return $(audioElm[0]);

      } else {
        console.log('creating audio element');

        var audio = document.createElement('audio');
        this.$el.append(audio);

        return $(audio);
      }
    }    
  });


  /* Create a new TrackList */
  var tracklist = new JB.PlayList(window.tracks),
      playlist = new JB.PlayListView({ /* and associate it to a view */
        collection: tracklist,
        el: '.tracks'
      });

  /* Player Instance */
  var player = new JB.Player({
    el: '.player'
  });

  /* Render all the things */
  playlist.render();
  player.render();

  /* Add event listener for keyboard controls, would need to be part of a view eventually */
  document.addEventListener('keypress', function (e) {
    if(e.which !== 32) return;
    e.preventDefault();
    JB.trigger('keyboard:spacebar');
  }, true);
})();


window.utils = window.utils || {};
window.utils.audio = {};

/**
* Start audio playing with fade in period.
*
* @param {Object} audio HTML5 audio element
* @param {Number} (optional) rampTime How long is the fade in ms
* @param {Number} targetVolume Max volume. 1 = default = HTML5 audio max.
* @param {Number} tick Timer period in ms
*/
window.utils.audio.smoothPlay = function(audio, rampTime, targetVolume, tick) {
  if(!targetVolume) {
     targetVolume = 1;
  }

  // By default, ramp up in one second
  if(!rampTime) {
     rampTime = 1000;
  }

  // How often adjust audio volume (ms)
  if(!tick) {
    tick = 10;
  }

  var volumeIncrease = targetVolume / (rampTime / tick);

  var playingEventHandler = null;

  function ramp() {
    var vol = Math.min(targetVolume, audio.volume + volumeIncrease);

    audio.volume = vol;

    // Have we reached target volume level yet?
    if(audio.volume < targetVolume) {
      // Keep up going until 11
      setTimeout(ramp, tick);
    }
  }

  function startRampUp() {
    // For now, we capture only the first playing event
    // as we assume the user calls fadeIn()
    // every time when wants to resume playback
    audio.removeEventListener("playing", playingEventHandler);

    ramp();
  }

  // Start with zero audio level
  audio.volume = 0;

  // Start volume ramp up when the audio actually stars to play (not when begins to buffer, etc.)
  audio.addEventListener("playing", startRampUp);

  audio.play();
};

/**
* Stop audio playing with fade out period.
*
* @param {Object} audio HTML5 audio element
* @param {Number} (optional) rampTime How long is the fade in ms
* @param {Number} targetVolume Min volume. 0 = default = HTML5 audio min.
* @param {Number} tick Timer period in ms
*/
window.utils.audio.smoothPause = function(audio, rampTime, targetVolume, tick) {
  var orignalVolume = audio.volume;

  if(!targetVolume) {
    targetVolume = 0;
  }

  // By default, ramp up in one second
  if(!rampTime) {
    rampTime = 1000;
  }

  // How often adjust audio volume (ms)
  if(!tick) {
    tick = 10;
  }

  var volumeStep = (audio.volume - targetVolume) / (rampTime / tick);

  if(!volumeStep) {
    // Volume already at 0
    return;
  }

  function ramp() {
    var vol = Math.max(0, audio.volume - volumeStep);

    audio.volume = vol;
    // Have we reached target volume level yet?
    if(audio.volume > targetVolume) {
      // Keep up going until 11
      setTimeout(ramp, tick);
    } else {
      audio.pause();
      // Reset audio volume so audio can be played again
      audio.volume = orignalVolume;
    }
  }

  ramp();
};

