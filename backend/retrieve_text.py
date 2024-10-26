import os
import urllib.request
from bs4 import BeautifulSoup
import json
from dotenv import load_dotenv

# Load the .env file from the output directory
load_dotenv(os.path.join(os.path.dirname(__file__), 'output', '.env'))

def return_text(url):
    # Set up the request with a User-Agent header
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'}
    
    req = urllib.request.Request(url, headers=headers)

    try:
        html = urllib.request.urlopen(req)
    except Exception as e:
        print(f"An error occurred: {e}")
        return

    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "meta", "noscript", "link"]):
        tag.decompose()

    all_elements = soup.find_all(True)
    text_data = []
    for element in all_elements:
        text = element.get_text(strip=True)
        text_data.append(text)

    full_text = ''.join(text_data)

    # Output to JSON file in the output directory
    output_file_path = os.path.join(os.path.dirname(__file__), 'output', 'output.json')
    with open(output_file_path, 'w') as json_file:
        json.dump({"text": full_text}, json_file)

    print(len(full_text))

if __name__ == "__main__":
    # Read the URL from the environment variable
    url = os.getenv('STORED_URL')
    if not url:
        print("No URL found in the environment variable.")
    else:
        return_text(url)
