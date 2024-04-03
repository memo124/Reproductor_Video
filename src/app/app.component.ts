import { Component, OnInit, ElementRef,ChangeDetectorRef } from '@angular/core';
declare global {
  interface Window {
    YT: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  player: any; // Cambiado a 'any'
  videoId: string = '1n1LQs83T9w';
  volume: number = 100;
  videoProgress: number = 0;

  constructor(private elementRef: ElementRef,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Cargar la API de YouTube cuando se inicie el componente
    this.loadYoutubeApi();
  }

  // Función para cargar la API de YouTube
  loadYoutubeApi() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Inicializar el reproductor de YouTube después de cargar la API
    window['onYouTubeIframeAPIReady'] = () => {
      this.initPlayer();
    };
  }

  // Inicializar el reproductor de YouTube
  initPlayer() {
    this.player = new window.YT.Player('player', {
      height: '700',
      width: '800',
      videoId: this.videoId,
      playerVars:{
        playersinline:1,
        autoplay:0,
        controls:0,
        modestbranding: 1
    },
      events: {
        'onReady': (event: any)=>{
          this.onPlayerReady.bind(this);
        },
        'onStateChange': (event: any) => {
          this.onPlayerStateChange.bind(this);
          if (event.data == window.YT.PlayerState.PLAYING) {
            setInterval(() => {
              this.videoProgress = this.player.getCurrentTime();
              this.cdr.detectChanges();
            }, 1000);
          }
        }
      }
    });
  }

  togglePlayPause() {
    if (this.player) {
      const playerState = this.player.getPlayerState();
      if (playerState === 1) {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    }
  }

  toggleFullScreen() {
    const playerElement = document.getElementById('player');
    if (playerElement) {
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      }
    }
  }
  exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  setVolume() {
    if (this.player) {
      this.player.setVolume(this.volume);
    }
  }

  getVideoDuration(): number {
    return this.player ? this.player.getDuration() : 0;
  }

  seekTo() {
    if (this.player) {
      this.player.seekTo(this.videoProgress, true);
    }
  }
  changeVideoQuality(quality: string) {
    if (this.player) {
      if (quality === 'auto') {
        this.player.setPlaybackQuality('default');
      } else {
        this.player.setPlaybackQuality(quality);
      }
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }

  onPlayerReady(event: any) {
    event.target.playVideo();
  }

  onPlayerStateChange(event: any) {
    if (event.data == window.YT.PlayerState.ENDED) {
      console.log("Video has ended.");
    }
  }
}
