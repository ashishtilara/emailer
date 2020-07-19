# Emailer

## Develop locally

1. install all required dependencies (`npm i`)
2. copy `environment.template.sh` to `environment.sh` and populate the environment variable values
3. run `npm start`
4. to deploy to cloud,
    - from local machine
        - assuming `environment.sh` exist and environment variables are populated
        - run `npm run deploy` 
    - thru CI
        - set all environment variables listed in `environment.template.sh` as CI environment variables
        - in CI, execute `npm i` to install all dependencies and deploy with `npm run deploy` 

## Endpoints

### `POST /v1/email`

```json
{
  "to": ["a@b.co"],
  "cc": ["a@b.co"],
  "bcc": ["a@b.co"],
  "message": {
    "subject": "",
    "body": {
      "text": "",
      "html": ""
    }
  }
}
```

## TODO

- Unit-tests
- Add configuration validation
- Store credentials in KMS instead of environment variables
- 2 different lambdas, 
    - 1 to capture the requests and add to SQS, 2nd to process them
    - may require database to store actual request and put request ID in SQS
- Figure-out the limitations and validations of service provider (i.e. sendgrid) and implement the restrictions
- Authentication/Authorisation
- Introduce multiple adapters for different providers
- Scheduling
