document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("videoId");

    if (!videoId) {
        console.error("Video ID is missing from the URL");
        return;
    }

    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data);

            const video = data.find(v => v.id == videoId);

            if (!video) {
                console.error("Video not found for ID:", videoId);
                return;
            }

            console.log("Extracted Video URL:", video.video_source);

            const titleElement = document.getElementById("video-title");
            const descElement = document.getElementById("video-description");
            const videoPlayer = document.getElementById("video-player");
            const viewsElement = document.getElementById("views-count");
            const likesElement = document.getElementById("likes-count");

            // Function to generate a random number in a given range
            function generateRandomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // Load or generate views and likes
            const storedStats = JSON.parse(localStorage.getItem(`videoStats_${videoId}`));

            if (!storedStats) {
                var videoStats = {
                    views: generateRandomNumber(95000, 700000),
                    likes: generateRandomNumber(20000, 80000)
                };
                localStorage.setItem(`videoStats_${videoId}`, JSON.stringify(videoStats));
            } else {
                var videoStats = storedStats;
            }

            // Set video metadata
            if (titleElement) titleElement.textContent = video.title;
            if (descElement) descElement.textContent = video.description;
            if (videoPlayer) {
                videoPlayer.src = video.video_source;
                videoPlayer.load();
            }

            // Set views and likes
            viewsElement.textContent = videoStats.views.toLocaleString();
            likesElement.textContent = videoStats.likes.toLocaleString();

            // Load and display the ad
            const adTagUrl = "https://s.magsrv.com/v1/vast.php?idzone=5557594"; // The VAST ad URL from your provider

            if (adTagUrl) {
                const adPlayer = document.getElementById("ad-player");
                const vastClient = new VastClient();

                vastClient.load(adTagUrl).then(ad => {
                    adPlayer.style.display = "block";
                    adPlayer.src = ad.videoURL;
                    adPlayer.load();
                    adPlayer.play().catch(error => console.warn("Autoplay blocked:", error));

                    // After the ad finishes, show the main video
                    adPlayer.onended = function () {
                        adPlayer.style.display = "none";
                        videoPlayer.style.display = "block";
                        videoPlayer.play().catch(error => console.warn("Autoplay blocked:", error));
                    };
                }).catch(error => {
                    console.error("Error loading VAST ad:", error);
                    videoPlayer.play().catch(error => console.warn("Autoplay blocked:", error));
                });
            } else {
                videoPlayer.play().catch(error => console.warn("Autoplay blocked:", error));
            }
        })
        .catch(error => console.error("Error loading JSON:", error));
});


document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const videosPerPage = 45;
    const totalCardsPerPage = 48;
    let totalVideos = 0;
    let totalPages = 1;
    let jsonData = [];
    let filteredData = [];

    const videoGrid = document.getElementById("video-grid");
    const mainContainer = document.querySelector("main");
    // Function to shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Attach event listeners to navigation links
document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default navigation

        // Shuffle videos and reload
        filteredData = shuffleArray([...jsonData]); 
        totalVideos = filteredData.length;
        totalPages = Math.ceil(totalVideos / videosPerPage);
        currentPage = 1;
        loadVideos(currentPage);
        createPagination();
    });
});

    // Insert Ad Spaces
    const adContainer1 = createAdContainer("Advertisement 728x90");
    mainContainer.insertBefore(adContainer1, videoGrid);

    // Pagination Container
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";
    mainContainer.appendChild(paginationContainer);

    // Description Section
    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("site-description");
    descriptionContainer.innerHTML = `
        <h2>Welcome to Our Site</h2>
        <p>Enjoy high-quality videos, exclusive content, and live streaming with your favorite models. Browse our categories and discover new videos daily.</p>
    `;
    mainContainer.appendChild(descriptionContainer);

    // Large Ad Space (900x250)
    const largeAdContainer = createAdContainer("Advertisement 900x250", "large-ad");
    mainContainer.insertBefore(largeAdContainer, paginationContainer);

    // Footer
const footer = document.createElement("footer");
footer.innerHTML = `
    <div class="footer-links">
        <a href="#">About Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact</a>
        <a href="/2257.html">2257 Compliance</a>
    </div>
    <p><strong>18 USC 2257 Compliance Statement:</strong> All models appearing on this website were 18 or older at the time of production. Click <a href="/2257.html">here</a> for more details.</p>
    <p>&copy; ${new Date().getFullYear()} PornoHD.Porn - All Rights Reserved</p>
`;
document.body.appendChild(footer);


    // Search Bar Handling
    setupSearchBar();

    // Fetch JSON Data
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            filteredData = jsonData;
            totalVideos = filteredData.length;
            totalPages = Math.ceil(totalVideos / videosPerPage);
            loadVideos(currentPage);
            createPagination();
        })
        .catch(error => console.error("Error loading JSON:", error));

    // Load Videos Function
    function loadVideos(page) {
        videoGrid.innerHTML = "";
        let startIndex = (page - 1) * videosPerPage;
        let endIndex = Math.min(startIndex + videosPerPage, filteredData.length);
        let videoCount = 0;

        for (let i = 0; i < totalCardsPerPage; i++) {
            const card = document.createElement("div");

            if ([3, 17, 42].includes(i)) {
                card.classList.add("video-card", "ad-card");
                card.textContent = "Ad Space";
            } else if (videoCount < endIndex - startIndex) {
                const article = filteredData[startIndex + videoCount];
                card.classList.add("video-card");

                const thumbnailContainer = document.createElement("div");
                thumbnailContainer.classList.add("video-thumbnail");

                const img = document.createElement("img");
                img.src = article.thumbnail;
                img.alt = article.title;
                img.loading = "lazy";

                const duration = document.createElement("div");
                duration.classList.add("video-duration");
                duration.textContent = article.duration;

                thumbnailContainer.appendChild(img);
                thumbnailContainer.appendChild(duration);

                const title = document.createElement("div");
                title.classList.add("video-title");
                title.textContent = article.title;

                // Load or generate views & likes
                const videoStats = getVideoStats(article.id);
                const stats = document.createElement("div");
                stats.classList.add("video-stats");
                stats.innerHTML = `
                    <span class="views"><i class="fa-solid fa-eye"></i> ${videoStats.views.toLocaleString()}</span> 
                    <span class="likes"><i class="fa-solid fa-heart"></i> ${videoStats.likes.toLocaleString()}</span>
                `;
                // Redirect to player.html with videoId
                card.addEventListener("click", () => {
                    window.location.href = `player.html?videoId=${article.id}`;
                });
                
                card.appendChild(thumbnailContainer);
                card.appendChild(title);
                card.appendChild(stats);

                enableImageSlideshow(card, img, article.images, article.thumbnail);

                videoCount++;
            }
            

            videoGrid.appendChild(card);
        }
    }

    // Pagination System (Scrolls to Top on Click)
    function createPagination() {
        paginationContainer.innerHTML = "";
        let startPage = Math.max(1, currentPage - 6);
        let endPage = Math.min(totalPages, startPage + 6);
    
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("pagination-btn");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                currentPage = i;
                hideVideoElements(); // Hide video elements when pagination is clicked
                loadVideos(currentPage);
                createPagination();
                scrollToTop();
            });
            paginationContainer.appendChild(button);
        }
    
        if (endPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = endPage + 1;
            nextButton.classList.add("pagination-btn");
            nextButton.addEventListener("click", () => {
                currentPage = endPage + 1;
                hideVideoElements(); // Hide video elements when pagination is clicked
                loadVideos(currentPage);
                createPagination();
                scrollToTop();
            });
            paginationContainer.appendChild(nextButton);
        }
    }
    
    function hideVideoElements() {
        const titleElement = document.getElementById("video-title");
        const descElement = document.getElementById("video-description");
        const videoPlayer = document.getElementById("video-player");
        const adPlayer = document.getElementById("ad-player");
        const adSpace = document.getElementById("ad-space"); // New Ad Space
        const videoStats = document.getElementById("video-stats"); // Views & Likes
    
        if (titleElement) titleElement.style.display = "none";
        if (descElement) descElement.style.display = "none";
        if (videoPlayer) videoPlayer.style.display = "none";
        if (adPlayer) adPlayer.style.display = "none";
        if (adSpace) adSpace.style.display = "none"; // Hide the Ad Space
        if (videoStats) videoStats.style.display = "none"; // Hide Views & Likes
    }
    
    
    
    // Smooth Scroll to Top Function
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Search Videos
    function searchVideos(query) {
        filteredData = query.trim()
            ? jsonData.filter(article => article.title.toLowerCase().includes(query.toLowerCase()))
            : jsonData;

        totalVideos = filteredData.length;
        totalPages = Math.ceil(totalVideos / videosPerPage);
        currentPage = 1;
        loadVideos(currentPage);
        createPagination();
    }

    // Scroll to Top
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Helper Functions
    function createAdContainer(text, className = "ad-space") {
        const container = document.createElement("div");
        container.classList.add(className);
        container.textContent = text;
        return container;
    }

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function enableImageSlideshow(card, img, images, defaultThumbnail) {
        let currentIndex = 0;
        let interval;

        card.addEventListener("mouseenter", () => {
            interval = setInterval(() => {
                img.src = images[currentIndex];
                currentIndex = (currentIndex + 1) % images.length;
            }, 500);
        });

        card.addEventListener("mouseleave", () => {
            clearInterval(interval);
            img.src = defaultThumbnail;
        });
    }

    function setupSearchBar() {
        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");

        if (searchInput && searchButton) {
            searchButton.addEventListener("click", () => searchVideos(searchInput.value));

            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") searchVideos(searchInput.value);
            });
        } else {
            console.error("Search input or button not found.");
        }
    }

    // Local Storage Functions for Views & Likes
    function getVideoStats(videoId) {
        let stats = JSON.parse(localStorage.getItem(`video_${videoId}`));
        if (!stats) {
            stats = {
                views: generateRandomNumber(95000, 700000),
                likes: generateRandomNumber(20000, 80000),
            };
            localStorage.setItem(`video_${videoId}`, JSON.stringify(stats));
        }
        return stats;
    }
});
