import urllib
from bs4 import BeautifulSoup

categories_site = urllib.request.urlopen("https://world.openfoodfacts.org/categories")

soup = BeautifulSoup(categories_site, "html.parser")

table = soup.find(id="tagstable")
links= table.find_all("a")

out_file = open("categories.tsv", "wb")
out_file.write("name\n".encode("utf8"))
for link in links:
	if ":" not in link.get_text():
		to_write = link.get_text() + "\n"
		out_file.write(to_write.encode("utf8"))
out_file.close()