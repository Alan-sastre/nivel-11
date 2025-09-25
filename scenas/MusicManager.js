class MusicManager {
    constructor() {
        if (MusicManager.instance) {
            return MusicManager.instance;
        }

        MusicManager.instance = this;
        this.music = null;
        this.isPlayingState = false;
    }

    static getInstance() {
        if (!MusicManager.instance) {
            MusicManager.instance = new MusicManager();
        }
        return MusicManager.instance;
    }

    setMusic(music) {
        // Solo cambiar la música si no hay una ya configurada o si es diferente
        if (!this.music || this.music !== music) {
            if (this.music && this.isPlayingState) {
                this.music.stop();
            }
            this.music = music;
        }
    }

    playMusic() {
        if (this.music && !this.isPlayingState) {
            this.music.play({ volume: 0.1, loop: true });
            this.isPlayingState = true;
        }
    }

    stopMusic() {
        if (this.music && this.isPlayingState) {
            this.music.stop();
            this.isPlayingState = false;
        }
    }

    pauseMusic() {
        if (this.music && this.isPlayingState) {
            this.music.pause();
            this.isPlayingState = false;
        }
    }

    resumeMusic() {
        if (this.music && !this.isPlayingState) {
            this.music.resume();
            this.isPlayingState = true;
        }
    }

    isPlaying() {
        return this.isPlayingState && this.music && this.music.isPlaying;
    }
}