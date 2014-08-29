;(function() {
  "use strict";

  var JB = new Marionette.Application();

  _.extend(JB, Backbone.Events);

  _.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
  };

  /* A track */
  JB.TrackModel = Backbone.Model.extend({
    defaults : {
      'id': '',
      'title': ''
    }
  });

  /* A track in the list */
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

  /* The list */
  JB.PlayList = Backbone.Collection.extend({
    model: JB.TrackModel
  });

  /* The list (just a <ul> tag really) */
  JB.PlayListView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    childView: JB.SingleTrackView
  });

  /* The player model, sort of.. */
  JB.PlayerModel = Backbone.Model.extend({
    defaults : {
      'id': '',
      'title': 'nothing to play :(',
      'state': 'paused'
    }
  });

  /* The spaghetti plate */
  JB.Player = Backbone.Marionette.CompositeView.extend({
    template: '#playerTemplate',
    model: new JB.PlayerModel(),
    events: {
      'click': 'togglePlayPause'
    },
    initialize: function () {
      var self = this;

      /* Bind Events */
      JB.on('track:click', function(model){
        if (self.model.id === model.id) {
          self.togglePlayPause();
        } else { 
          $('.player').removeClass('playing');
          self.$el.find('h1 .title').text('Loading...');
          self.$el.find('h1 .timer').text('');
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
    initPlayer: function () {
      var self = this;
      this.model.clear().set(self.model.defaults);
      self.$el.find('h1 .title').text('nothing to play :(');
      self.$el.find('h1 .timer').text('');
      $('.player').removeClass('playing');
    },
    togglePlayPause: function(){
      var audio = $('audio')[0] || null;

      if (!audio) return;

      if (audio.paused) {
        window.utils.audio.smoothPlay(audio, 400);
      } else {
        window.utils.audio.smoothPause(audio, 200);
      }
      $('.player').toggleClass('playing');
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
        self.$el.addClass('playing');
        JB.trigger('player:play', model);
      };
      var updateTimer = function () {
        var minutes = Math.round(audio.currentTime/60),
            seconds = Math.round(audio.currentTime%60);

        var timer = (minutes<10 ? '0' + minutes : minutes) + ':' + (seconds<10 ? '0' + seconds : seconds);
        
        self.$el.find('h1 .timer').text('[' + timer + ']');
      };
      var reinit = function () {
        self.initPlayer();
      };

      $audio.on('canplay', play);
      $audio.on('timeupdate', updateTimer);
      $audio.on('ended', reinit);
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


  /* 
   * booting all the thing 
   */
  
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
