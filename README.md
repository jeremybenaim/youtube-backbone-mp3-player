Needz [ffmpeg](https://www.ffmpeg.org/) and [youtube-dl](http://rg3.github.io/youtube-dl/) (and node, and npm, and a computer connected to internet, duh...)

Todos:
- audios end event (fucking up the updateTimer function)
- get duration (in tracks.json?) to increment the elapsedTime div width value on updateTimer
- cross-fade between songs (create new Audio then smoothPause audio A when audio B canplay event is fired)
- add other streaming sources supported by youtube-dl
- re-architecture the models and views because Jeremy Ashkenas would kick my ass if he saw this
- a lot of other stuff I guess, but who's reading that anyway :)
