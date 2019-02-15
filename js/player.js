class VideoPlayer {
    constructor(settings) {
        this._settings = Object.assign(VideoPlayer.DefaultSettings, settings);
        this._videoContainer = null;
        this._toggleBtn = null;
        this._playSpeed = null;
        this._skipPrevBtn = null;
        this._skipNextBtn = null;
        this._mouseDown = false;
        // this._keyDown = false; ///////
    }


    init() {
        if (!this._settings.videoUrl) return console.error('Provide video Url');
        if (!this._settings.videoPlayerContainer) return console.error('Please provide video player container');

        // Создаем разметку для video
        this._addTemplate();
        // Найти все элементы управления
        this._setElements();
        // Установить обработчики событий
        this._setEvents();
    }


    toggle() {
        const method = this._video.paused ? 'play' : 'pause';
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
        this._video[method]();
    }

    _videoProgressHandler() {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progress.style.flexBasis = `${percent}%`;
        if (percent === 100) this._toggleBtn.textContent = '►';
    }

    _peremotka(event) {
        this._video.currentTime = (event.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }
    // создаем обработчик изменения звука
    _changeVolume() {
        this._video.volume = this._volume.value;
    }

    // создаем обработчик изменения скорости воспроизведения
    _changeSpeed() {
        this._video.playbackRate = this._playSpeed.value;
    }

    // создаем обработчик перемотки назад
    _skipBack() {
        this._video.currentTime -= this._settings.skipPrev;
    }
    // создаем обработчик перемотки вперед
    _skipForward() {
        this._video.currentTime += this._settings.skipNext;
    }

    // обработчик на паузу/воспроизведение пробелом
    keyDown() {
        if (event.key == 32) {
            const method2 = this._video.paused ? 'play' : 'pause';
            this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
            this._video[method2]();
        }
    }

    _addTemplate() {
        const template = this._createVideoTemplate();
        const container = document.querySelector(this._settings.videoPlayerContainer);
        container ? container.insertAdjacentHTML('afterbegin', template) : console.error('Video container was not found');
    }

    _setElements() {
        this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
        this._video = this._videoContainer.querySelector('video');
        this._toggleBtn = this._videoContainer.querySelector('.toggle');
        this._progress = this._videoContainer.querySelector('.progress__filled');
        this._progressContainer = this._videoContainer.querySelector('.progress');
        // добавила єлементы на звук, перемотку
        this._volume = this._videoContainer.querySelector('.volume');
        this._playSpeed = this._videoContainer.querySelector('.playbackRate');
        this._skipPrevBtn = this._videoContainer.querySelector('.skipPrev');
        this._skipNextBtn = this._videoContainer.querySelector('.skipNext');
    }

    _setEvents() {
        this._video.addEventListener('click', () => this.toggle());
        this._toggleBtn.addEventListener('click', () => this.toggle());
        // this._keyDown.addEventListener('keydown', () => this.keydown());
        this._video.addEventListener('timeupdate', () => this._videoProgressHandler());
        this._progressContainer.addEventListener('click', (e) => this._peremotka(e));
        this._volume.addEventListener('change', () => this._changeVolume());
        this._playSpeed.addEventListener('change', () => this._changeSpeed());
        this._skipPrevBtn.addEventListener('click', () => this._skipBack());
        this._skipNextBtn.addEventListener('click', () => this._skipForward());
        this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._peremotka(event));
        this._progressContainer.addEventListener('mousedown', () => this._mouseDown = true);
        this._progressContainer.addEventListener('mouseup', () => this._mouseDown = false);
    }

    _createVideoTemplate() {
        return `
        <div class="player">
            <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
            <div class="player__controls">
              <div class="progress">
              <div class="progress__filled"></div>
              </div>
              <button class="player__button toggle" title="Toggle Play">►</button>
              <input type="range" name="volume" class="player__slider volume" min=0 max="1" step="0.05" value="${this._settings.volume}">
              <input type="range" name="playbackRate" class="player__slider playbackRate" min="0.5" max="2" step="0.1" value="${this._settings.playSpeed}">
              <button data-skip=""${this._settings.skipPrev}"" class="player__button skipPrev">« ${this._settings.skipPrev}s</button>
              <button data-skip="${this._settings.skipNext}" class="player__button skipNext">${this._settings.skipNext}s »</button>
            </div>
      </div>
        `;
    }

    static get DefaultSettings() {
        return {
            videoUrl: '',
            videoPlayerContainer: 'body',
            volume: 0.5,
            playSpeed: 1
        };
    }
}


const playerInstance = new VideoPlayer({
    videoUrl: 'video/mov_bbb.mp4',
    skipNext: 1,
    skipPrev: 1
});

playerInstance.init();
