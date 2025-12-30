## Prompt

create a todolist app. It should be queue based. 

There should be two queues. Running Queue and Waiting queue. 

I should be able to take a task from running queue and either close it or put it under waiting queue. 

I can take tasks from Waiting queue and put it under Running Queue. 

It should be easily usable, example use left swipe or right swipe gestures in queue to either close or move to waiting queue. Pull down to push back of the queue. 

Similarly for waiting queue, it should use left swipe to close , right swipe to move to running queue. Pull down to move to running queue. 

Add ability to add new tasks to the running queue

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Email notifications (Gmail) 🔔

This app can send an email when a task moves from the waiting queue to the running queue. This requires running a small backend that uses Gmail SMTP (via Nodemailer).

Setup steps:

1. Copy `.env.example` to `.env` and fill in your Gmail credentials (use an App Password for security):

   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=no-reply@yourdomain.com
   PORT=4000
   # Optional in frontend .env: VITE_EMAIL_ENDPOINT=http://localhost:4000/send-email
   ```

2. Install dependencies and start the server:

   ```bash
   npm install
   npm run start:server
   ```

3. Start the frontend (in a separate terminal):

   ```bash
   npm run dev
   ```

4. When you first open the app you'll be prompted to enter the email address where notifications should be sent — this email is stored in `localStorage` and used when tasks move to the running queue.

Notes:

- For Gmail you'll most likely need to create an App Password instead of using your account password. See: https://support.google.com/accounts/answer/185833
- You can change the email later via the "Notification email" link in the app header.


## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
