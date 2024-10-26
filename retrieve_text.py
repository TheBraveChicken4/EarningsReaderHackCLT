import urllib.request  
from bs4 import BeautifulSoup 


def return_text(url):

    """
    Take a URL and return all the text from that page, 
    while excluding script tags, style tags, meta tags, noscript tags, and link tags.

    Parameters:
    url (str): The URL of the webpage to read.

    Returns:
    str: The full text of the page, joined into a single string.
    """
    html = urllib.request.urlopen(url) 

    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "meta", "noscript", "link"]):
        tag.decompose()

    all_elements = soup.find_all(True)

    text_data = []
    for element in all_elements:
        text = element.get_text(strip=True)
        text_data.append(text)

    full_text = ''.join(text_data)

    print(len(full_text))
    
return_text('https://investors.principal.com/news-releases/news-release-details/principal-financial-group-announces-third-quarter-2024-results')




