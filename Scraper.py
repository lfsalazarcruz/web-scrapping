import requests

page = requests.get("https://www.udemy.com/java-tutorial/#/")

print(page.content)