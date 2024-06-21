document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const loader = document.getElementById('loader');
    const videoSrc = 'https://cdn1.flexsportx.com/live/zone-11/chunks.m3u8';

    if (Hls.isSupported()) {
        const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
            startLevel: -1,
            autoStartLoad: true,
            debug: false,
        });

        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

        hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Network error encountered:', data);
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Media error encountered:', data);
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        break;
                }
            }
        });

        hls.on(Hls.Events.BUFFER_APPENDING, function() {
            loader.style.display = 'block';
        });

        hls.on(Hls.Events.BUFFER_APPENDED, function() {
            loader.style.display = 'none';
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
});
