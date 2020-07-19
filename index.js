const Ajv = require('ajv');
const Boom = require('boom');
const Request = require('@itcutives/serverless-helpers/src/request');
const Response = require('@itcutives/serverless-helpers/src/response');
const LambdaResponseFormatter = require('@itcutives/serverless-helpers/src/lambdaResponseFormatter');
const schema = require('./src/resources/email.json');
const SendGrid = require('./src/helpers/SendGrid');
const config = require('./src/helpers/Config');

// created here to share the same compiled schema for context
const ajv = new Ajv();
const validate = ajv.compile(schema);
const sendGrid = new SendGrid(config.sendgrid);

module.exports.email = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const request = Request.normaliseLambdaRequest(event);
  const response = new Response();

  try {
    const valid = validate(request.body);
    if (!valid) {
      throw Boom.badRequest('E01:Bad request', validate.errors);
    }

    await sendGrid.send(request.body);

    return LambdaResponseFormatter.responseHandler(response.respond(200, { result: 'success' }));
  } catch (e) {
    // eslint-disable-next-line no-return-await
    return LambdaResponseFormatter.errorHandler(e);
  }
};
