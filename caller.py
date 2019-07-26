from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json

def call():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?sort=market_cap'
    parameters = {
        'start': '1',
        'limit': '20',
        'convert': 'USD'
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': '8fedd383-dce8-48ce-874c-7bb28d9f058a',
    }
    session = Session()
    session.headers.update(headers)

    try:
        # load from call
        response = session.get(url, params=parameters)
        data = json.loads(response.text)

        # load from file
        #with open('data.json', 'r') as file:
        #    data = json.load(file)

        # Write to jsonfile
        with open('data.json', 'w+', encoding='utf-8') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)

    return(data)
