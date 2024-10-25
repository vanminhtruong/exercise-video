"use strict";
var VideoPlayer = /** @class */ (function () {
    function VideoPlayer() {
        var _this = this;
        this.video = document.querySelector('video');
        this.controls = document.querySelector('.controls');
        this.playButton = document.querySelector('.play');
        this.playButtonBig = document.querySelector('.play-big');
        this.volumeButton = document.querySelector('.volume');
        this.fullscreenButton = document.querySelector('.fullscreen');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.rewindButton = document.querySelector('.rewind');
        this.forwardButton = document.querySelector('.forward');
        this.videoWrapper = document.querySelector('.video-wrapper');
        this.controlsTimeout = null;
        this.currentTimeElement = document.querySelector('.curent-time');
        this.durationElement = document.querySelector('.duration');
        this.flag = false;
        // Kiểm tra xem các phần tử có tồn tại không
        if (!this.currentTimeElement || !this.durationElement) {
            console.error('Time elements not found in the DOM');
            return;
        }
        this.addEventListeners();
        this.video.addEventListener('loadedmetadata', function () {
            if (_this.durationElement) {
                _this.durationElement.textContent = _this.formatTime(_this.video.duration);
            }
        });
    }
    VideoPlayer.prototype.addEventListeners = function () {
        var _this = this;
        // Đảm bảo timeupdate được gọi thường xuyên
        this.video.addEventListener('timeupdate', function () {
            _this.updateProgress();
            _this.updateTime();
        });
        // Thêm listener cho loadeddata để cập nhật thời gian ban đầu
        this.video.addEventListener('loadeddata', function () {
            _this.updateTime();
        });
        // Các event listener khác
        this.video.addEventListener('play', function () { return _this.updatePlayButton(); });
        this.video.addEventListener('pause', function () { return _this.updatePlayButton(); });
        this.video.addEventListener('play', function () { return _this.startControlsTimeout(); });
        this.video.addEventListener('pause', function () { return _this.showControls(); });
        // Thay đổi trạng thái phát video khi nút phát được nhấn
        this.playButton.addEventListener('click', function () { return _this.togglePlay(); });
        // Thay đổi trạng thái phát video khi nút phát lớn được nhấn
        this.playButtonBig.addEventListener('click', function () { return _this.togglePlay(); });
        // Bật/tắt âm thanh khi nút âm lượng được nhấn
        this.volumeButton.addEventListener('click', function () { return _this.toggleMute(); });
        // Chuyển đổi chế độ toàn màn hình khi nút toàn màn hình được nhấn
        this.fullscreenButton.addEventListener('click', function () { return _this.toggleFullscreen(); });
        // Tua lại video 15 giây khi nút tua lại được nhấn
        this.rewindButton.addEventListener('click', function () { return _this.skip(-15); });
        // Tua tới video 15 giây khi nút tua tới được nhấn
        this.forwardButton.addEventListener('click', function () { return _this.skip(15); });
        // Thiết lập tiến trình video khi thanh tiến trình được nhấn
        this.progressBar.addEventListener('click', function (e) { return _this.setProgress(e); });
        // Hiển thị các điều khiển khi di chuột vào vùng video
        this.videoWrapper.addEventListener('mousemove', function () { return _this.showControls(); });
        // Bắt đầu hẹn giờ ẩn các điều khiển khi chuột rời khỏi vùng video
        this.videoWrapper.addEventListener('mouseleave', function () {
            if (!_this.video.paused) {
                _this.startControlsTimeout();
            }
        });
        // Xử lý các phím bấm trên bàn phím
        document.addEventListener('keydown', function (e) { return _this.handleKeypress(e); });
    };
    VideoPlayer.prototype.formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = Math.floor(seconds % 60);
        if (hours > 0) {
            return "".concat(hours, ":").concat(this.addZero(minutes), ":").concat(this.addZero(secs));
        }
        return "".concat(minutes, ":").concat(this.addZero(secs));
    };
    VideoPlayer.prototype.addZero = function (num) {
        return num < 10 ? "0".concat(num) : num.toString();
    };
    VideoPlayer.prototype.updateTime = function () {
        if (!this.currentTimeElement || !this.durationElement) {
            console.error('Time elements not found!');
            return;
        }
        // Làm tròn currentTime để tránh số thập phân
        var currentTime = Math.floor(this.video.currentTime);
        var duration = Math.floor(this.video.duration);
        try {
            // Cập nhật thời gian hiện tại
            this.currentTimeElement.textContent = this.formatTime(currentTime);
            this.durationElement.textContent = this.formatTime(duration);
        }
        catch (error) {
            console.error('Error updating time:', error);
        }
    };
    VideoPlayer.prototype.togglePlay = function () {
        if (this.video.paused) {
            this.video.play();
        }
        else {
            this.video.pause();
        }
    };
    VideoPlayer.prototype.updatePlayButton = function () {
        var icon = this.playButton.querySelector('i');
        var bigIcon = this.playButtonBig.querySelector('i');
        var playButtonBigElement = document.querySelector('.play-button-big');
        if (this.video.paused) {
            icon.className = 'fas fa-play';
            bigIcon.className = 'fas fa-play';
            playButtonBigElement.style.display = 'block';
        }
        else {
            icon.className = 'fas fa-pause';
            bigIcon.className = 'fas fa-pause';
            playButtonBigElement.style.display = 'none';
        }
    };
    VideoPlayer.prototype.toggleMute = function () {
        this.video.muted = !this.video.muted;
        var icon = this.volumeButton.querySelector('i');
        icon.className = this.video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    };
    VideoPlayer.prototype.toggleFullscreen = function () {
        if (!document.fullscreenElement) {
            this.videoWrapper.requestFullscreen();
            this.videoWrapper.classList.add('fullscreen-mode');
        }
        else {
            document.exitFullscreen();
            this.videoWrapper.classList.remove('fullscreen-mode');
        }
    };
    VideoPlayer.prototype.updateProgress = function () {
        var percentage = (this.video.currentTime / this.video.duration) * 100;
        this.progress.style.width = "".concat(percentage, "%");
    };
    VideoPlayer.prototype.setProgress = function (e) {
        var rect = this.progressBar.getBoundingClientRect();
        var pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    };
    VideoPlayer.prototype.skip = function (seconds) {
        this.video.currentTime += seconds;
    };
    VideoPlayer.prototype.startControlsTimeout = function () {
        var _this = this;
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        this.controlsTimeout = window.setTimeout(function () {
            _this.videoWrapper.classList.add('hide-controls');
        }, 5000);
    };
    VideoPlayer.prototype.showControls = function () {
        this.videoWrapper.classList.remove('hide-controls');
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        if (!this.video.paused) {
            this.startControlsTimeout();
        }
    };
    VideoPlayer.prototype.handleKeypress = function (e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'Escape':
                e.preventDefault();
                if (this.flag === false) {
                    document.exitFullscreen();
                    this.videoWrapper.classList.remove('fullscreen-mode');
                }
                else {
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
    };
    return VideoPlayer;
}());
// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new VideoPlayer();
});
