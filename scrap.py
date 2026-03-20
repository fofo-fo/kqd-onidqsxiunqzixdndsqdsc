import json
import re
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

INPUT_FILE = "articles.json"
OUTPUT_FILE = "updated_articles.json"

# Thread-safe writing
lock = threading.Lock()

# Reuse connection
session = requests.Session()

# -------- FUNCTION -------- #
def process_article(article, first_flag):
    try:
        title = article.get("title", "").strip()
        if not title:
            return None

        print(f"\n🔍 Searching: {title}")

        # -------- SEARCH -------- #
        res = session.post(
            "https://en.pornohd.blue/search/",
            data={"text": title},
            timeout=10
        )

        soup = BeautifulSoup(res.text, "html.parser")
        results = soup.select("div.preview_screen a")

        if not results:
            print("❌ No results")
            return None

        video_page = results[0]["href"]
        print("🎬 Opening:", video_page)

        # -------- VIDEO PAGE -------- #
        res2 = session.get(video_page, timeout=10)
        html = res2.text

        # -------- EXTRACT ALL MP4 -------- #
        urls = re.findall(r'https?://[^"\s]+\.mp4', html)

        if not urls:
            print("❌ No video found")
            return None

        # -------- PICK BEST QUALITY -------- #
        def get_quality(url):
            match = re.search(r'(\d{3,4})p', url)
            return int(match.group(1)) if match else 0

        best_url = max(urls, key=get_quality)

        print("✅ Best Video:", best_url)

        article["video_source"] = best_url

        return article

    except Exception as e:
        print("⚠️ Error:", e)
        return None


# -------- LOAD -------- #
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    articles = json.load(f)

# -------- START FILE -------- #
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("[\n")

first = True

# -------- MULTITHREAD -------- #
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(process_article, article, first) for article in articles]

    for future in as_completed(futures):
        result = future.result()

        if result:
            with lock:
                with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
                    if not first:
                        f.write(",\n")
                    json.dump(result, f, ensure_ascii=False, indent=4)
                    first = False

# -------- CLOSE -------- #
with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
    f.write("\n]")

print("\n🎉 DONE!")