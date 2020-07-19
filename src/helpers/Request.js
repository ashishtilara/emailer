const https = require('https');

class Request {
  /**
   * @param url
   * @param request
   * @param headers
   * @returns {Promise<unknown>}
   * @constructor
   */
  static POST(url, request, headers = {}) {
    return this.request('POST', url, request, headers);
  }

  /**
   * @param method
   * @param url
   * @param requestBody
   * @param headers
   * @returns {Promise<unknown>}
   */
  static request(method, url, requestBody = null, headers = {}) {
    const options = {
      method,
      hostname: url.hostname,
      port: null,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          let resp;
          try {
            resp = JSON.parse(body.toString());
          } catch (e) {
            resp = body.toString();
          }
          resolve({ status: res.statusCode, body: resp });
        });
      });

      req.on('error', reject);

      if (requestBody) {
        req.write(JSON.stringify(requestBody));
      }

      req.end();
    });
  }
}

module.exports = Request;
