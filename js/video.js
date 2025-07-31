// Load the YouTube IFrame Player API code asynchronously
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
    const videoWrapper = document.getElementById('videoPlayer');
    const playButton = document.getElementById('playButton');
    const videoThumbnail = document.querySelector('.video-thumbnail');
    
    // Create YouTube player
    player = new YT.Player('youtubeIframe', {
        videoId: 'Klt-b15onek',
        playerVars: {
            'autoplay': 1,
            'mute': 1,
            'controls': 0,
            'modestbranding': 1,
            'showinfo': 0,
            'loop': 1,
            'playlist': 'Klt-b15onek',
            'rel': 0,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    
    // When player is ready, start the video
    function onPlayerReady(event) {
        // Show the video after a short delay
        setTimeout(() => {
            videoWrapper.classList.add('playing');
            event.target.playVideo();
        }, 1000);
    }
    
    // Handle player state changes
    function onPlayerStateChange(event) {
        // If video ends, restart it
        if (event.data === YT.PlayerState.ENDED) {
            player.playVideo();
        }
    }
    
    // Manual play button
    playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        videoWrapper.classList.add('playing');
        player.playVideo();
    });
    
    // Click anywhere on the video wrapper to play
    videoWrapper.addEventListener('click', function() {
        if (!videoWrapper.classList.contains('playing')) {
            videoWrapper.classList.add('playing');
            player.playVideo();
        }
    });
}
