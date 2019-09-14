var fullscreenDefaults = {
    fullScreen: true
};

var Fullscreen = function(element) {

    this.el = element;

    this.core = window.lgData[this.el.getAttribute('lg-uid')];
    this.core.s = Object.assign({}, fullscreenDefaults, this.core.s);

    this.init();

    return this;
};


Fullscreen.prototype.isFullScreen = function() {
    let fsEle = (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
    return fsEle === this.core.outer;
};

Fullscreen.prototype.init = function() {
    let fullScreen = '';
    if (this.core.s.fullScreen) {

        // check for fullscreen browser support
        if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled &&
            !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
            return;
        } else {
            fullScreen = '<span class="lg-fullscreen lg-icon"></span>';
            this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
            this.fullScreen();
        }
    }
};

Fullscreen.prototype.requestFullscreen = function() {
    // outer = document.querySelector('.lg-outer');
    let el = this.core.outer;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    }
};

Fullscreen.prototype.exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
Fullscreen.prototype.fullScreen = function() {
    let _this = this;

    utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function() {
        if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
            utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
        } else {
            utils.addClass(_this.core.outer, 'lg-fullscreen-on');
        }
    });

    utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function() {
        if (_this.isFullScreen()) {
            _this.exitFullscreen();
        } else {
            _this.requestFullscreen();
        }
    });

};

Fullscreen.prototype.destroy = function() {

    // exit from fullscreen if activated
    if(this.isFullScreen()) {
        this.exitFullscreen();
    }

    utils.off(document, '.lgfullscreen');
};

window.lgModules.fullscreen = Fullscreen;
