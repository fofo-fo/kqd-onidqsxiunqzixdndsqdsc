<?php
$videoId = isset($_GET['videoId']) ? intval($_GET['videoId']) : 1; // Default to 1 if no ID provided

echo '<title>Watch HD Video #' . $videoId . ' - Free Streaming on SexHD</title>';
echo '<meta name="description" content="Enjoy high-quality streaming of video #' . $videoId . '. Watch the best adult content in HD, featuring top models and trending scenes.">';
echo '<meta name="keywords" content="HD video, streaming, adult content, free porn, trending videos, best models">';
echo '<meta name="robots" content="index, follow">';
echo '<meta name="author" content="SexHD">';
echo '<meta property="og:title" content="Watch HD Video #' . $videoId . ' - Free Streaming on SexHD">';
echo '<meta property="og:description" content="Enjoy high-quality streaming of video #' . $videoId . '. Watch the best adult content in HD, featuring top models and trending scenes.">';
echo '<meta property="og:image" content="https://sexhd.vercel.app/thumbnails/video' . $videoId . '.jpg">';
echo '<meta property="og:url" content="https://sexhd.vercel.app/player.html?videoId=' . $videoId . '">';
echo '<meta property="og:type" content="video.movie">';
?>
