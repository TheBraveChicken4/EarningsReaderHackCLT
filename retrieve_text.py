import urllib.request  
from bs4 import BeautifulSoup 

# # def tag_visitor(tag):
# #     if isinstance(tag, Comment):
# #         return False
# #     elif tag.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
# #         return False
# #     return True

# def return_text(url):

#     html = urllib.request.urlopen(url) 

#     soup = BeautifulSoup(html, 'html.parser')
#     # paragraph = [p.get_text(strip=True) for p in soup.find_all('p')]
#     # for parahraph in soup.find_all('p'):
#     #     print(parahraph.get_text())
    
#     ls = [l.get_text(strip=True) for l in soup.find_all('td')]

#     # for l in list:
#     #     print(list.get_text())

#     # text = soup.findAll(string=True)

#     # visible_texts = paragraph.split('\n')
#     # visible_lists = ls.split('\n')

#     print(paragraph)
#     print(ls)

#     # return ' '.join(t.strip() for t in visible_texts)

# # print(return_text(html_doc))
# print(return_text('https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2025'))

# import urllib.request  
# from bs4 import BeautifulSoup 

# # def tag_visitor(tag):
# #     if isinstance(tag, Comment):
# #         return False
# #     elif tag.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
# #         return False
# #     return True

def return_text(url):

    html = urllib.request.urlopen(url) 

    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "meta", "noscript", "link"]):
        tag.decompose()

    all_elements = soup.find_all(True)

    text_data = []
    for element in all_elements:
        text = element.get_text(strip=True)
        text_data.append(text)
    

    # earnings_data = []
    # for element in all_elements:
    #     text = element.get_text(strip=True)
    #     # Check if text contains earnings-related keywords
    #     if any(keyword in text.lower() for keyword in ["revenue", "earnings", "income", "loss", "net", "quarter"]):
    #         earnings_data.append(text)

    full_text = ''.join(text_data)

    print(len(full_text))
    
return_text('https://investors.principal.com/news-releases/news-release-details/principal-financial-group-announces-third-quarter-2024-results')




