# Distance Learning Parser
![Continuous Integration Flows](https://github.com/alexlapinski/serverless.distance-learning/workflows/Continuous%20Integration%20Flows/badge.svg)

Fetch the current list of homework / distance learning and save it to s3.

## Requirements
 * Plantuml (doc generation)
 * NodeJS 12.x
 * NPM

## Get Started
1. Clone this repo
    ```sh
    git clone git@github.com:alexlapinski/serverless.distance-learning.git
    ```
2. Install Dependencies
    ```sh
    npm install
    ```
3. [Optional] Run Tests
    ```sh
    npm test
    ```

## Deployment
1. Ensure ```serverless``` is installed on your path.
    ```sh
    npm install --global serverless
    ```
    or
    ```sh
    npm update --global serverless
    ```
2. [Optional] Setup AWS Access
    * [Serverless.com](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
3. Run Serverless deploy
    ```sh
    ```