import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";

// Function to convert YouTube embed URLs to watch URLs
// This handles the common issue where seed data contains embed URLs but ReactPlayer needs watch URLs
// Also handles youtu.be short URLs
// Note: If you get error 150, it means the video owner has disabled embedding
// Solution: Replace the video URL in seed-data.js with a video that allows embedding
function convertYouTubeUrl(url) {
  if (!url) return url;
  
  // Convert embed URL to watch URL
  if (url.includes('youtube.com/embed/')) {
    const videoId = url.split('/embed/')[1];
    // Remove any additional parameters after the video ID
    const cleanVideoId = videoId.split('?')[0];
    return `https://www.youtube.com/watch?v=${cleanVideoId}`;
  }
  
  // Convert youtu.be URLs to watch URLs
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1];
    const cleanVideoId = videoId.split('?')[0];
    return `https://www.youtube.com/watch?v=${cleanVideoId}`;
  }
  
  // If it's already a watch URL, return as is
  if (url.includes('youtube.com/watch?v=')) {
    return url;
  }
  
  return url;
}

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Convert URL to proper format for ReactPlayer
  const convertedUrl = convertYouTubeUrl(url);

  // Debug logging
  useEffect(() => {
    console.log("🎥 VideoPlayer Debug:", {
      originalUrl: url,
      convertedUrl,
      playing,
      error,
      loading,
      duration,
      urlType: convertedUrl ? (convertedUrl.includes('youtube') ? 'YouTube' : convertedUrl.includes('cloudinary') ? 'Cloudinary' : 'Direct URL') : 'No URL'
    });
    
    // Test with a working video if no URL is provided
    if (!convertedUrl) {
      console.log("⚠️ No video URL provided. You can test with these URLs:");
      console.log("  - https://www.youtube.com/watch?v=dQw4w9WgXcQ (YouTube)");
      console.log("  - https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4 (MP4)");
    }
  }, [url, convertedUrl, playing, error, loading, duration]);

  function handlePlayAndPause() {
    if (!convertedUrl) {
      setError("No video URL provided");
      return;
    }
    setPlaying(!playing);
    setError(null);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    if (playerRef?.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, currentTime - 5));
    }
  }

  function handleForward() {
    if (playerRef?.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo(Math.min(duration, currentTime + 5));
    }
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function handleReady() {
    console.log("✅ Video ready to play");
    setLoading(false);
    setError(null);
    if (playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }

  function handleError(error) {
    console.error("❌ Video playback error:", error);
    
    let errorMessage = "Failed to load video. Please check the URL and try again.";
    
    // Handle YouTube-specific error codes
    if (error?.code) {
      switch (error.code) {
        case 2:
          errorMessage = "Invalid YouTube video ID. Please check the URL.";
          break;
        case 5:
          errorMessage = "YouTube video is not available in your region.";
          break;
        case 100:
          errorMessage = "YouTube video not found or removed.";
          break;
        case 101:
        case 150:
          errorMessage = "This YouTube video cannot be played in embedded players. The video owner has disabled embedding. Please try a different video or contact the instructor.";
          break;
        default:
          errorMessage = `YouTube error ${error.code}: ${error.message || 'Unknown error'}`;
      }
    } else if (error?.message) {
      if (error.message.includes('CORS')) {
        errorMessage = "CORS error: Video cannot be loaded due to cross-origin restrictions.";
      } else if (error.message.includes('network')) {
        errorMessage = "Network error: Please check your internet connection.";
      } else if (error.message.includes('format')) {
        errorMessage = "Video format not supported. Please try a different video.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    
    setError(errorMessage);
    setLoading(false);
    setPlaying(false);
  }

  function handleStart() {
    console.log("▶️ Video started playing");
    setLoading(false);
    setError(null);
  }

  function handleBuffer() {
    console.log("⏳ Video buffering...");
    setLoading(true);
  }

  function handleBufferEnd() {
    console.log("✅ Video buffering complete");
    setLoading(false);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current?.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1 && onProgressUpdate && progressData) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played, onProgressUpdate, progressData]);

  // Reset state when URL changes
  useEffect(() => {
    setPlaying(false);
    setPlayed(0);
    setError(null);
    setLoading(true);
    setDuration(0);
  }, [convertedUrl]);

  // Show error state
  if (error) {
    return (
      <div
        className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center
        ${isFullScreen ? "w-screen h-screen" : ""}`}
        style={{ width, height }}
      >
        <div className="text-center text-white p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          {convertedUrl && (
            <div className="text-xs text-gray-400 mb-4 p-2 bg-gray-800 rounded">
              <p><strong>Original URL:</strong> {url}</p>
              <p><strong>Converted URL:</strong> {convertedUrl}</p>
              <p><strong>Type:</strong> {convertedUrl.includes('youtube') ? 'YouTube' : convertedUrl.includes('cloudinary') ? 'Cloudinary' : 'Direct URL'}</p>
              {error?.includes('embedding') && convertedUrl.includes('youtube') && (
                <div className="mt-2 p-2 bg-blue-900 rounded">
                  <p className="text-blue-300 mb-2">💡 This video cannot be embedded, but you can watch it directly on YouTube:</p>
                  <a 
                    href={convertedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              )}
            </div>
          )}
          <Button 
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && !convertedUrl) {
    return (
      <div
        className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center
        ${isFullScreen ? "w-screen h-screen" : ""}`}
        style={{ width, height }}
      >
        <div className="text-center text-white p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={convertedUrl}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onReady={handleReady}
        onError={handleError}
        onStart={handleStart}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous",
            },
            forceVideo: true,
          },
          youtube: {
            playerVars: {
              origin: window.location.origin,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              enablejsapi: 1,
              allowfullscreen: 1,
              // Add these to help with embedding issues
              fs: 1,
              iv_load_policy: 3,
              cc_load_policy: 0,
            },
            embedOptions: {
              host: 'https://www.youtube-nocookie.com'
            }
          },
        }}
        controls={false}
        light={false}
        pip={false}
        stopOnUnmount={true}
        playsinline={true}
      />
      
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                disabled={!convertedUrl}
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                disabled={!convertedUrl}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                disabled={!convertedUrl}
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white text-sm">
                {formatTime(played * duration)}/ {formatTime(duration)}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

VideoPlayer.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  url: PropTypes.string,
  onProgressUpdate: PropTypes.func,
  progressData: PropTypes.object,
};

export default VideoPlayer;
