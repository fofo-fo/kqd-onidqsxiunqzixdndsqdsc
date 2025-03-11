<?php
header("Content-type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// Static pages
$static_pages = [
    'https://sexhd.vercel.app/'
];

foreach ($static_pages as $page) {
    echo "<url>";
    echo "<loc>$page</loc>";
    echo "<lastmod>" . date('Y-m-d') . "</lastmod>";
    echo "<priority>1.0</priority>";
    echo "</url>";
}

// Dynamic video pages
for ($i = 1; $i <= 1061; $i++) {
    echo "<url>";
    echo "<loc>https://sexhd.vercel.app/player.html?videoId=$i</loc>";
    echo "<lastmod>" . date('Y-m-d') . "</lastmod>";
    echo "<priority>0.8</priority>";
    echo "</url>";
}

echo "</urlset>";
?>
