from flask import Flask, jsonify, request
from urllib.parse import urlparse
import tldextract

def find_combosquatting(url):
    """
    takes a url and returns a list of trademarks the url
    may be trying to combosquat.
    """
    
    domain = urlparse(url).netloc
    false_trademark = tldextract.extract(domain).domain
    print(false_trademark)
    return is_substring(false_trademark, 4)


def is_substring(false_domain_name, minimal_str_len = 4):
    """
    Takes a false domain name and scans a file or database to check
    for registered trademarks of which the the false domain name is a substring and
    returns a list containing any matches found whose length is less than 
    minimal_str_len.
    """

    matches = []
    # combare with trademarks in file
    path =\
            '/Users/obedababio/Documents/Spring 2021/CPSC 490/SafeLink/SafeLinkBackEnd/file_database/trademarks.txt'
    custom_file = open(path, 'r')
    lines = custom_file.readlines()
    for string in lines:
        trademark_name = string.rstrip()
        if trademark_name in false_domain_name and trademark_name != false_domain_name:
            matches.append(trademark_name)

    matches = set(matches)
    return list(matches)


#print(find_combosquatting('http://www.somethingpepsisomething.com/foo/bar'))




app = Flask(__name__)

@app.route('/', methods=['POST'])
def mock_response():
    response_dict = {
        'STATUS': 'PASSED'
    }
    url = request.json["domain_name"]
    print(f'flask received this url: {url}')

    combo_list = find_combosquatting(url)
    print(combo_list)
    if len(combo_list) > 0:
        response_dict['comboSquatting'] = combo_list
        response_dict['STATUS'] = "FAILED"

    return jsonify(response_dict)

if __name__ == '__main__':
   app.run(debug = True)
