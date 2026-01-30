[mike-grail.com](https://www.mike-grail.com/) is a website that is dedicated to showcasing Michael Yang's designer clothing collection. Michael's writing is honest, appreciative, and never flashy, defying the "in-group vs. out-group" dynamic that is typically seen in the online fashion space.  
  
Mike Captcha, an extension of the site, is a fashion themed, behavior-based CAPTCHA. It collects interaction metrics through the browser, then validates behavior server-side through API calls, and returns a pass token that gates access to the site's landing page.

## Server-side Validation

The browser tracks duration, number of movements, and jitter, then sends the data to the server to be verified.
![Backend diagram showing browser interaction and server-side verification](https://de1wwae7728z6.cloudfront.net/images/mike-grail/backend_diagram.png)

## Inspiration

The glasses slider was heavily inspired by this security verification on Shopee. I have seen my fair share of slider puzzles but I had never seen one that rotated the puzzle element.

![Shopee](https://miro.medium.com/v2/resize:fit:1164/format:webp/1*2dqkVyEMdPeqA84rcvbvLw.gif)


