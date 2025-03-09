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

    // Load Videos Function
   // Load Videos Function
function loadVideos(page) {
    videoGrid.innerHTML = "";
    let startIndex = (page - 1) * videosPerPage;
    let endIndex = Math.min(startIndex + videosPerPage, filteredData.length);
    let videoCount = 0;
    let adInjected = false; // Ensure script is added only once

    for (let i = 0; i < totalCardsPerPage; i++) {
        const card = document.createElement("div");

        // Ad Cards: positions 3, 17, 42
        if ([3, 17, 42].includes(i)) {
            card.classList.add("video-card", "ad-card");

            let adZoneId;
            if (i === 3) adZoneId = "5558196";
            else if (i === 17) adZoneId = "5558198";
            else if (i === 42) adZoneId = "5558200";

            const adIns = document.createElement("ins");
            adIns.className = "eas6a97888e2";
            adIns.setAttribute("data-zoneid", adZoneId);

            card.appendChild(adIns);
            videoGrid.appendChild(card);

            // Ensure script is loaded only once
            if (!adInjected) {
                const adScript = document.createElement("script");
                adScript.async = true;
                adScript.src = "https://a.magsrv.com/ad-provider.js";
                document.body.appendChild(adScript);
                adInjected = true; // Prevent multiple injections
            }

            // Delay loading ads slightly to allow rendering
            setTimeout(() => {
                if (window.AdProvider) {
                    window.AdProvider.push({ serve: {} });
                }
            }, 1000);
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

            const videoStats = getVideoStats(article.id);
            const stats = document.createElement("div");
            stats.classList.add("video-stats");
            stats.innerHTML = `
                <span class="views"><i class="fa-solid fa-eye"></i> ${videoStats.views.toLocaleString()}</span> 
                <span class="likes"><i class="fa-solid fa-heart"></i> ${videoStats.likes.toLocaleString()}</span>
            `;

            card.addEventListener("click", () => {
                window.location.href = `player.html?videoId=${article.id}`;
            });

            card.appendChild(thumbnailContainer);
            card.appendChild(title);
            card.appendChild(stats);

            enableImageSlideshow(card, img, article.images, article.thumbnail);

            videoCount++;
            videoGrid.appendChild(card);
        }
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
                loadVideos(currentPage);
                createPagination();
                scrollToTop(); // Scroll to top when clicked
            });
            paginationContainer.appendChild(button);
        }

        // Add button for next pages dynamically
        if (endPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = endPage + 1;
            nextButton.classList.add("pagination-btn");
            nextButton.addEventListener("click", () => {
                currentPage = endPage + 1;
                loadVideos(currentPage);
                createPagination();
                scrollToTop(); // Scroll to top when clicked
            });
            paginationContainer.appendChild(nextButton);
        }
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
