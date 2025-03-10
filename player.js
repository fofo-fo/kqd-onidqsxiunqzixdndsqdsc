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

    //############################# Advertisement 728x90 and 300x50 for mobile in the top of home page - (banner) start #################

// Function to insert ads dynamically
function insertAd(isMobile) {
    const adContainer = document.getElementById("dynamic-ad");

    // Clear existing ad content
    adContainer.innerHTML = "";

    // Create ad script
    const adScript = document.createElement("script");
    adScript.async = true;
    adScript.type = "application/javascript";
    adScript.src = "https://a.magsrv.com/ad-provider.js";

    // Create new <ins> element
    const adIns = document.createElement("ins");
    adIns.className = isMobile ? "eas6a97888e10" : "eas6a97888e2";
    adIns.setAttribute("data-zoneid", isMobile ? "5558210" : "5558208");

    // Create AdProvider script
    const adProviderScript = document.createElement("script");
    adProviderScript.textContent = "(AdProvider = window.AdProvider || []).push({'serve': {}});";

    // Append elements to ad container
    adContainer.appendChild(adScript);
    adContainer.appendChild(adIns);
    adContainer.appendChild(adProviderScript);
}

// Function to handle ad switching based on screen width
function handleAdSwitch() {
    const isMobile = window.matchMedia("(max-width: 448px)").matches;
    insertAd(isMobile);
}

// Create the ad container
const adContainer1 = document.createElement("div");
adContainer1.id = "dynamic-ad";
adContainer1.classList.add("ad-space");
mainContainer.insertBefore(adContainer1, videoGrid);

// Initial ad setup
handleAdSwitch();

// Listen for screen size changes
window.addEventListener("resize", handleAdSwitch);

//############################# Advertisement 728x90 and 300x50 for mobile in the top of home page - (banner) end #################

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
//############################# the three Ad cards  start #################
    // Load Videos Function
   function loadVideos(page) {
    videoGrid.innerHTML = ""; // Clear the video grid
    let startIndex = (page - 1) * videosPerPage;
    let endIndex = Math.min(startIndex + videosPerPage, filteredData.length);
    let videoCount = 0;

    for (let i = 0; i < totalCardsPerPage; i++) {
        const card = document.createElement("div");

        // Check if the current index is an ad position
        if (i === 3 || i === 17 || i === 42) {
            card.classList.add("video-card", "ad-card");

            if (i === 3) {
                // First ad: magsrv.com with zoneid 5558480
                const adScript1 = document.createElement("script");
                adScript1.async = true;
                adScript1.type = "application/javascript";
                adScript1.src = "https://a.magsrv.com/ad-provider.js";

                const adIns1 = document.createElement("ins");
                adIns1.className = "eas6a97888e2";
                adIns1.setAttribute("data-zoneid", "5558480");

                const adInitScript1 = document.createElement("script");
                adInitScript1.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;

                card.appendChild(adScript1);
                card.appendChild(adIns1);
                card.appendChild(adInitScript1);
            } else if (i === 17) {
                // Second ad: magsrv.com with zoneid 5558494
                const adScript2 = document.createElement("script");
                adScript2.async = true;
                adScript2.type = "application/javascript";
                adScript2.src = "https://a.magsrv.com/ad-provider.js";

                const adIns2 = document.createElement("ins");
                adIns2.className = "eas6a97888e2";
                adIns2.setAttribute("data-zoneid", "5558494");

                const adInitScript2 = document.createElement("script");
                adInitScript2.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;

                card.appendChild(adScript2);
                card.appendChild(adIns2);
                card.appendChild(adInitScript2);
            } else if (i === 42) {
                // Third ad: magsrv.com with zoneid 5558484
                const adScript3 = document.createElement("script");
                adScript3.async = true;
                adScript3.type = "application/javascript";
                adScript3.src = "https://a.magsrv.com/ad-provider.js";

                const adIns3 = document.createElement("ins");
                adIns3.className = "eas6a97888e2";
                adIns3.setAttribute("data-zoneid", "5558484");

                const adInitScript3 = document.createElement("script");
                adInitScript3.textContent = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;

                card.appendChild(adScript3);
                card.appendChild(adIns3);
                card.appendChild(adInitScript3);
            }

            videoGrid.appendChild(card);
        } else if (videoCount < endIndex - startIndex) {
            // Load a video card
            const article = filteredData[startIndex + videoCount];
            card.classList.add("video-card");

            // Create thumbnail container
            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("video-thumbnail");

            // Create and configure the thumbnail image
            const img = document.createElement("img");
            img.src = article.thumbnail;
            img.alt = article.title;
            img.loading = "lazy";

            // Create and configure the video duration
            const duration = document.createElement("div");
            duration.classList.add("video-duration");
            duration.textContent = article.duration;

            // Append the image and duration to the thumbnail container
            thumbnailContainer.appendChild(img);
            thumbnailContainer.appendChild(duration);

            // Create and configure the video title
            const title = document.createElement("div");
            title.classList.add("video-title");
            title.textContent = article.title;

            // Fetch and display video stats
            const videoStats = getVideoStats(article.id);
            const stats = document.createElement("div");
            stats.classList.add("video-stats");
            stats.innerHTML = `
                <span class="views"><i class="fa-solid fa-eye"></i> ${videoStats.views.toLocaleString()}</span> 
                <span class="likes"><i class="fa-solid fa-heart"></i> ${videoStats.likes.toLocaleString()}</span>
            `;

            // Add click event to navigate to the video player
            card.addEventListener("click", () => {
                window.location.href = `player.html?videoId=${article.id}`;
            });

            // Append all elements to the card
            card.appendChild(thumbnailContainer);
            card.appendChild(title);
            card.appendChild(stats);

            // Enable image slideshow (if applicable)
            enableImageSlideshow(card, img, article.images, article.thumbnail);

            // Increment the video count and append the card to the grid
            videoCount++;
            videoGrid.appendChild(card);
        }
    }
}
//############################# the three Ad cards  end #################
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
    let isTouchScrolling = false; // Detect if user is scrolling

    function startSlideshow() {
        // Stop any active slideshows before starting a new one
        stopAllSlideshows();

        interval = setInterval(() => {
            img.src = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;
        }, 500);

        // Store active interval in the card element (to clear later)
        card.dataset.slideshowActive = "true";
        card.dataset.intervalId = interval;
    }

    function stopSlideshow() {
        clearInterval(interval);
        img.src = defaultThumbnail;
        card.dataset.slideshowActive = "false";
    }

    function stopAllSlideshows() {
        document.querySelectorAll(".video-card").forEach((otherCard) => {
            if (otherCard.dataset.slideshowActive === "true") {
                clearInterval(otherCard.dataset.intervalId);
                const imgElement = otherCard.querySelector("img");
                if (imgElement) {
                    imgElement.src = imgElement.dataset.defaultThumbnail;
                }
                otherCard.dataset.slideshowActive = "false";
            }
        });
    }

    // Store the default thumbnail
    img.dataset.defaultThumbnail = img.src;

    // Mouse Events for Desktop
    card.addEventListener("mouseenter", startSlideshow);
    card.addEventListener("mouseleave", stopSlideshow);

    // Touch Events for Mobile
    card.addEventListener("touchstart", (event) => {
        isTouchScrolling = false; // Reset scrolling state
        startSlideshow();
    });

    card.addEventListener("touchmove", () => {
        isTouchScrolling = true; // User is scrolling
    });

    card.addEventListener("touchend", () => {
        if (!isTouchScrolling) stopSlideshow(); // Stop only if NOT scrolling
    });

    card.addEventListener("touchcancel", stopSlideshow);
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
