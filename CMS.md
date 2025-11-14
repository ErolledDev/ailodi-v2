Got it. Let's start from the very beginning, assuming you have a Cloudflare account, a GitHub account, and a basic Cloudflare Worker project ready in a GitHub repository.

The goal is to automatically deploy your Cloudflare Worker whenever you publish content in your CMS

Full Guide: Automated Cloudflare Worker Deployment from CMS Publish Action
This guide will walk you through setting up a workflow where your CMS (Content Management System) triggers a deployment of your Cloudflare Worker via GitHub Actions.

Core Idea:

Your CMS sends a webhook (an automated HTTP POST request) when content is published.

This webhook is sent to a specific GitHub Actions endpoint.

GitHub Actions hears the webhook, runs a pre-defined workflow.

The GitHub Actions workflow uses the wrangler CLI to deploy your Cloudflare Worker.

Prerequisites:
A Cloudflare Account

A GitHub Account

A Cloudflare Worker project already set up locally and pushed to a GitHub Repository. Your repository should contain:

Your Worker's source code (e.g., src/index.ts or src/index.js)

A wrangler.toml file (your Worker's configuration)

A package.json (if you have dependencies or a build step)

Access to your CMS's webhook configuration (e.g., Contentful, Strapi, Sanity, Ghost, DatoCMS, etc.)

Step 1: Prepare Your Cloudflare Worker and GitHub Repository
Ensure your Worker project is ready for automated deployments.

1.1 Verify Your wrangler.toml
Make sure your wrangler.toml file correctly defines your Worker. A minimal example:

Ini, TOML

# wrangler.toml
name = "my-awesome-worker" # Your Worker's desired name on Cloudflare
main = "src/index.ts"     # Path to your Worker's entry file
compatibility_date = "2024-07-01" # Or a newer date
1.2 Create a Cloudflare API Token for Deployment
This token will allow GitHub Actions to deploy Workers to your Cloudflare account.

Log in to your Cloudflare Dashboard: https://dash.cloudflare.com/

Click on "My Profile" (usually your email address in the top right corner).

Go to "API Tokens" in the left sidebar.

Click "Create Token".

Select "Create Custom Token".

Token Name: Give it a descriptive name like github-actions-worker-deploy.

Permissions:

Account: Workers Scripts - Edit (Allows deploying/updating Workers)

Account: Workers Routes - Edit (If your Worker uses custom routes)

Account: Account Settings - Read (Necessary for Wrangler to find your Account ID)

Client IP Address Filtering (Optional but Recommended): If your CI/CD runner has static IPs, you can whitelist them for extra security. Otherwise, leave blank.

Save the token. Immediately copy the generated token string. This is the only time you'll see it. If you lose it, you'll need to generate a new one.

1.3 Get Your Cloudflare Account ID
You'll need this for Wrangler to know which Cloudflare account to deploy to.

In your Cloudflare Dashboard, navigate to the "Workers & Pages" section.

Your Account ID is usually displayed in the right-hand sidebar. Copy this ID.

1.4 Add Cloudflare Credentials to GitHub Secrets
GitHub Secrets securely store sensitive information that your GitHub Actions workflows can use.

Go to your GitHub Repository: github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME

Click on Settings (tab at the top of the repository).

In the left sidebar, click Secrets and variables > Actions.

Click "New repository secret".

Name: CF_API_TOKEN

Secret: Paste the Cloudflare API Token you copied in Step 1.2.

Click "Add secret".

Click "New repository secret" again.

Name: CF_ACCOUNT_ID

Secret: Paste your Cloudflare Account ID you copied in Step 1.3.

Click "Add secret".

Step 2: Create the GitHub Actions Workflow
This YAML file defines the automated process that will run when your CMS sends a webhook.

In your GitHub repository, create a directory .github/workflows/.

Inside this directory, create a new file named deploy-worker-from-cms.yml.

YAML

# .github/workflows/deploy-worker-from-cms.yml
name: Deploy Worker via CMS Webhook

# This 'on' section defines WHEN the workflow will run.
on:
  # 1. repository_dispatch: This is the crucial part for external webhooks.
  #    The 'types' specify the custom event names your webhook will send.
  repository_dispatch:
    types: [cms_publish_worker] # Define a unique event type here.
                               # Your CMS webhook MUST send this exact type.
  # 2. workflow_dispatch: This allows you to manually trigger the workflow
  #    from the 'Actions' tab in your GitHub repository, useful for testing.
  workflow_dispatch:
    inputs:
      reason:
        description: 'Reason for manual dispatch'
        required: false
        default: 'Manual trigger from GitHub'

# 'jobs' define the actual tasks that will be executed.
jobs:
  deploy:
    runs-on: ubuntu-latest # The operating system for the GitHub Actions runner

    steps:
      - name: Checkout repository code
        uses: actions/checkout@v4 # Action to clone your GitHub repo into the runner

      - name: Set up Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Specify your Worker's Node.js version

      - name: Install Cloudflare Wrangler CLI
        # Installs the Wrangler CLI globally, which is used to build and deploy Workers
        run: npm install -g wrangler@latest

      - name: Install Worker dependencies
        # Only run if your Worker project has a package.json with 'dependencies'
        run: npm install

      - name: Build Worker (e.g., compile TypeScript)
        # Only run if your Worker requires a build step (e.g., from TypeScript to JavaScript)
        # This assumes you have a "build" script in your package.json, like "tsc"
        run: npm run build

      - name: Deploy Cloudflare Worker
        # Uses the official Cloudflare Wrangler GitHub Action for seamless deployment
        uses: cloudflare/wrangler-action@v1
        with:
          # Required: Cloudflare API Token (from GitHub Secrets)
          apiToken: ${{ secrets.CF_API_TOKEN }}
          # Required: Cloudflare Account ID (from GitHub Secrets)
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          # The 'command' to execute. 'deploy' is for standard deployments.
          # You can add flags, e.g., 'deploy --minify' or 'deploy --config my-worker-dir/wrangler.toml'
          command: 'deploy'
          # Optional: You can specify the worker name here if it differs from wrangler.toml
          # or if you manage multiple named workers/environments.
          # name: 'my-awesome-worker'
          # environment: 'production' # If you use environments in wrangler.toml
Commit this file to your GitHub repository on the branch you want to use for deployments (e.g., main).

Step 3: Configure Your CMS Webhook
Now, go to your CMS's dashboard and set up the webhook that will trigger the GitHub Action.

3.1 Locate Webhook Settings in Your CMS
Every CMS has a slightly different interface:

Look for sections like "Webhooks," "Integrations," "API," "Developer Settings," or "Automations" in your CMS's admin panel.

Find the option to create a "New Webhook" or "Add Webhook."

3.2 Enter the Webhook URL
This is the address where your CMS will send the trigger signal.

Webhook URL: https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/dispatches

Replace:

YOUR_GITHUB_USERNAME: Your personal GitHub username or your GitHub organization name.

YOUR_REPO_NAME: The exact name of the GitHub repository containing your Cloudflare Worker.

3.3 Set the HTTP Method
HTTP Method (or Request Type): Select POST. This is mandatory for GitHub's repository_dispatch endpoint.

3.4 Configure HTTP Headers
These headers provide authentication and tell GitHub how to interpret the request.

Create a GitHub Personal Access Token (PAT) for the Webhook:

Go to your GitHub profile settings: Click your profile picture (top right) > Settings.

In the left sidebar, scroll down to Developer settings.

Click Personal access tokens > Tokens (classic).

Click Generate new token (or Generate new token (classic)).

Token Name: CMS_Webhook_for_Worker_Deploy (or similar).

Expiration: Choose an appropriate expiration date (e.g., 90 days, 1 year). Avoid "No expiration."

Scopes (Permissions): Grant it the repo scope. This gives it sufficient permissions to trigger workflows in your repository. (For public repos, public_repo might work, but repo is safer.)

Click Generate token.

CRITICAL: Copy the generated token immediately! You will not see it again. Store it securely.

Add Headers in your CMS Webhook Configuration:

Header 1:

Name: Authorization

Value: Bearer YOUR_GITHUB_PAT (Replace YOUR_GITHUB_PAT with the token you just copied.)

Header 2: (This header is specific to repository_dispatch events)

Name: Accept

Value: application/vnd.github.everest-preview+json

3.5 Construct the JSON Payload Body
This is the actual data your CMS sends. It must include an event_type that matches what you defined in your GitHub Actions workflow.

Payload (JSON Body):

JSON

{
  "event_type": "cms_publish_worker", // This MUST match the 'types' in your workflow file!
  "client_payload": {
    "content_id": "ARTICLE_SLUG_OR_ID_FROM_CMS", // Optional: Pass useful data from your CMS
    "published_by": "CMS_USER_NAME",            // Optional: e.g., `{{ user.name }}` if your CMS supports templating
    "timestamp": "2025-07-01T07:00:00Z"          // Optional: e.g., `{{ date.iso }}`
  }
}
"event_type": Ensure this string ("cms_publish_worker" in this example) exactly matches the types array you set in your deploy-worker-from-cms.yml file (types: [cms_publish_worker]).

"client_payload": This is optional. You can include any data your CMS provides that might be relevant for logging or further actions in your GitHub workflow (though for a simple deploy, it's not strictly necessary). Most CMSs allow you to inject dynamic content (like content_id, user_name, timestamp) into the JSON payload using templating.

3.6 Define Trigger Event in CMS
Specify when the webhook should fire. Common triggers include:

"On publish" (for a specific content type or all content)

"On unpublish"

"On update"

"On delete"

Select "On publish" for your scenario.

3.7 Save and Test Your Webhook in the CMS
Save your webhook configuration in the CMS.

Most CMSs have a "Test Webhook" or "Send Test Payload" button. Use this.

Immediately after, go to your GitHub repository and click on the "Actions" tab. You should see your "Deploy Worker via CMS Webhook" workflow start running.

If it fails, click on the workflow run to view the logs and identify the error. Common issues are incorrect API tokens, incorrect event_type, or missing headers.

By following these steps, you will have a robust automated deployment pipeline for your Cloudflare Worker, triggered directly by your content publishing actions in your CMS. This allows for seamless updates of your edge logic or data based on your content changes.
