class VideoPlayer {
    private video: HTMLVideoElement = document.querySelector('video')!;
    private controls: HTMLDivElement = document.querySelector('.controls')!;
    private playButton: HTMLButtonElement = document.querySelector('.play')!;
    private playButtonBig: HTMLButtonElement = document.querySelector('.play-big')!;
    private volumeButton: HTMLButtonElement = document.querySelector('.volume')!;
    private fullscreenButton: HTMLButtonElement = document.querySelector('.fullscreen')!;
    private progressBar: HTMLDivElement = document.querySelector('.progress-bar')!;
    private progress: HTMLDivElement = document.querySelector('.progress')!;
    private rewindButton: HTMLButtonElement = document.querySelector('.rewind')!;
    private forwardButton: HTMLButtonElement = document.querySelector('.forward')!;
    private videoWrapper: HTMLDivElement = document.querySelector('.video-wrapper')!;
    private controlsTimeout: number | null = null;
    private currentTimeElement: HTMLSpanElement = document.querySelector('.curent-time')!;
    private durationElement: HTMLSpanElement = document.querySelector('.duration')!;
    private flag:boolean = false;
    
    constructor() {
        // Kiểm tra xem các phần tử có tồn tại không
        if (!this.currentTimeElement || !this.durationElement) {
            console.error('Time elements not found in the DOM');
            return;
        }

        this.addEventListeners();
        this.video.addEventListener('loadedmetadata', () => {
            if (this.durationElement) {
                this.durationElement.textContent = this.formatTime(this.video.duration);
            }
        });
    }

    private addEventListeners() {
        // Đảm bảo timeupdate được gọi thường xuyên
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTime();
        });

        // Thêm listener cho loadeddata để cập nhật thời gian ban đầu
        this.video.addEventListener('loadeddata', () => {
            this.updateTime();
        });

        // Các event listener khác
        this.video.addEventListener('play', () => this.updatePlayButton());
        this.video.addEventListener('pause', () => this.updatePlayButton());
        this.video.addEventListener('play', () => this.startControlsTimeout());
        this.video.addEventListener('pause', () => this.showControls());

        // Thay đổi trạng thái phát video khi nút phát được nhấn
        this.playButton.addEventListener('click', () => this.togglePlay());
        
        // Thay đổi trạng thái phát video khi nút phát lớn được nhấn
        this.playButtonBig.addEventListener('click', () => this.togglePlay());
        
        // Bật/tắt âm thanh khi nút âm lượng được nhấn
        this.volumeButton.addEventListener('click', () => this.toggleMute());
        
        // Chuyển đổi chế độ toàn màn hình khi nút toàn màn hình được nhấn
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        
        // Tua lại video 15 giây khi nút tua lại được nhấn
        this.rewindButton.addEventListener('click', () => this.skip(-15));
        
        // Tua tới video 15 giây khi nút tua tới được nhấn
        this.forwardButton.addEventListener('click', () => this.skip(15));
        
        // Thiết lập tiến trình video khi thanh tiến trình được nhấn
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));

        // Hiển thị các điều khiển khi di chuột vào vùng video
        this.videoWrapper.addEventListener('mousemove', () => this.showControls());
        
        // Bắt đầu hẹn giờ ẩn các điều khiển khi chuột rời khỏi vùng video
        this.videoWrapper.addEventListener('mouseleave', () => {
            if (!this.video.paused) {
                this.startControlsTimeout();
            }
        });

        // Xử lý các phím bấm trên bàn phím
        document.addEventListener('keydown', (e) => this.handleKeypress(e));
    }

    private formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${this.addZero(minutes)}:${this.addZero(secs)}`;
        }
        return `${minutes}:${this.addZero(secs)}`;
    }

    private addZero(num: number): string {
        return num < 10 ? `0${num}` : num.toString();
    }

    private updateTime() {
        if (!this.currentTimeElement || !this.durationElement) {
            console.error('Time elements not found!');
            return;
        }

        // Làm tròn currentTime để tránh số thập phân
        const currentTime = Math.floor(this.video.currentTime);
        const duration = Math.floor(this.video.duration);
        
        try {
            // Cập nhật thời gian hiện tại
            this.currentTimeElement.textContent = this.formatTime(currentTime);
            this.durationElement.textContent = this.formatTime(duration);
        } catch (error) {
            console.error('Error updating time:', error);
        }
    }

    private togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    private updatePlayButton() {
        const icon = this.playButton.querySelector('i')!;
        const bigIcon = this.playButtonBig.querySelector('i')!;
        const playButtonBigElement = document.querySelector('.play-button-big') as HTMLElement;

        if (this.video.paused) {
            icon.className = 'fas fa-play';
            bigIcon.className = 'fas fa-play';
            playButtonBigElement.style.display = 'block';
        } else {
            icon.className = 'fas fa-pause';
            bigIcon.className = 'fas fa-pause';
            playButtonBigElement.style.display = 'none';
        }
    }

    private toggleMute() {
        this.video.muted = !this.video.muted;
        const icon = this.volumeButton.querySelector('i')!;
        icon.className = this.video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.videoWrapper.requestFullscreen();
            this.videoWrapper.classList.add('fullscreen-mode');
        } else {
            document.exitFullscreen();
            this.videoWrapper.classList.remove('fullscreen-mode');
        }
    }

    private updateProgress() {
        const percentage = (this.video.currentTime / this.video.duration) * 100;
        this.progress.style.width = `${percentage}%`;
    }

    private setProgress(e: MouseEvent) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }

    private skip(seconds: number) {
        this.video.currentTime += seconds;
    }

    private startControlsTimeout() {
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        this.controlsTimeout = window.setTimeout(() => {
            this.videoWrapper.classList.add('hide-controls');
        }, 5000);
    }

    private showControls() {
        this.videoWrapper.classList.remove('hide-controls');
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        if (!this.video.paused) {
            this.startControlsTimeout();
        }
    }

    private handleKeypress(e: KeyboardEvent) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'Escape':
                e.preventDefault();
                if(this.flag === false){
                    document.exitFullscreen();
                    this.videoWrapper.classList.remove('fullscreen-mode');
                }else{
                    this.videoWrapper.requestFullscreen();
                    this.videoWrapper.classList.add('fullscreen-mode');
                }
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'ArrowLeft':
                this.skip(-15);
                break;
            case 'ArrowRight':
                this.skip(15);
                break;
        }
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});
