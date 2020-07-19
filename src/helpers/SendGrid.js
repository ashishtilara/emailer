const { URL } = require('url');
const Boom = require('boom');
const loGet = require('lodash.get');
const Request = require('./Request');

class SendGrid {
  constructor({ key, from }) {
    this.url = new URL('https://api.sendgrid.com/v3/mail/send');
    this.key = key;
    this.from = from;
  }

  /**
   * @param request
   * @returns {{personalizations: [{to: *}, {cc: *}, {bcc: *}], subject: *, from: {email: *}, content: [{type: string, value: *}, {type: string, value: *}]}}
   */
  prepareRequestBody(request) {
    const body = {
      personalizations: [
        { to: loGet(request, 'to', []).map((email) => ({ email })) },
      ],
      from: { email: this.from },
      subject: loGet(request, 'message.subject'),
      content: [],
    };
    const cc = loGet(request, 'cc', []);
    if (cc.length > 0) {
      body.personalizations.push({ cc: cc.map((email) => ({ email })) });
    }

    const bcc = loGet(request, 'bcc', []);
    if (bcc.length > 0) {
      body.personalizations.push({ bcc: bcc.map((email) => ({ email })) });
    }

    const bodyText = loGet(request, 'message.body.text');
    if (bodyText) {
      body.content.push({ type: 'text/plain', value: bodyText });
    }

    const bodyHtml = loGet(request, 'message.body.html');
    if (bodyHtml) {
      body.content.push({ type: 'text/html', value: bodyHtml });
    }

    return body;
  }

  /**
   * @returns {{Authorization: string}}
   */
  getHeaders() {
    return {
      Authorization: `Bearer ${this.key}`,
    };
  }

  /**
   * @param request
   * @returns {Promise<string>}
   */
  async send(request) {
    const response = await Request.POST(this.url, this.prepareRequestBody(request), this.getHeaders());
    if (response.status !== 202) {
      throw Boom.internal('E02: Request Failed', response.body);
    }
    return 'success';
  }
}

module
  .exports = SendGrid;
