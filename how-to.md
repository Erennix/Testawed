# How to Customize Your Valentine Website 💖

This guide will help you customize your Valentine's website and understand how it works.

## 🛠️ Configuration

You can customize the main text, GIF, and Discord integration without touching the code!

1.  Open the file `server/config.json`.
2.  You will see a structure like this:

```json
{
  "discordWebhookUrl": "",
  "gifUrl": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6/l4pTfx2qLSznW/giphy.gif",
  "question": "Will you be my valentine?"
}
```

### Customization Options:

*   **`discordWebhookUrl`**: Paste your Discord Webhook URL here to get notified when they say YES!
    *   *To get a webhook URL: Go to Discord Server Settings -> Integrations -> Webhooks -> New Webhook -> Copy Webhook URL.*
    *   Example: `"discordWebhookUrl": "https://discord.com/api/webhooks/..."`
*   **`gifUrl`**: Change the main GIF by replacing the URL. You can use any direct image link (ending in .gif, .png, .jpg).
*   **`question`**: Change the big question text displayed on the main page.

## 📂 File Structure

Here's a quick overview of the important files if you want to dive deeper:

*   **`server/config.json`**: The settings file described above.
*   **`server/routes.ts`**: Handles the backend logic, including sending the Discord notification.
*   **`client/src/pages/valentine.tsx`**: The main page with the Yes/No game logic.
*   **`client/src/pages/landing.tsx`**: The starting page that asks for their name.
*   **`shared/schema.ts`**: Defines how the data is stored in the database.

## 🚀 Deployment

When you are ready to share it:
1.  Make sure you've added your Discord Webhook URL in `server/config.json`.
2.  Click the "Publish" button in Replit to make your site live!
3.  Send the link to your special someone! 💌

Enjoy your Valentine's Day! 💘
