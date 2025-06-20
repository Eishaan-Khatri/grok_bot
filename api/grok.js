// This is the main instruction file for our robot.
const Groq = require('groq-sdk');

// The robot will get its secret key from its "backpack" (environment variables)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// This is the main function. It listens for your Python bot's call.
export default async function handler(req, res) {
    // Only listen for POST requests (this is a security measure)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Sorry, you can't call me this way." });
    }

    try {
        // Take the "prompt" message from your Python bot's call
        const { prompt } = req.body;

        // If there's no prompt, send an error
        if (!prompt) {
            return res.status(400).json({ error: "You forgot to send me a prompt!" });
        }

        // Tell the Grok API to think about the prompt
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gemma-7b-it', // This is a great, fast model
        });

        // Get the final answer from Grok
        const grokResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I got a blank response.';
        
        // Send the answer back to your Python bot
        res.status(200).json({ response: grokResponse });

    } catch (error) {
        // If anything goes wrong, send an error message
        console.error('Robot had an error:', error);
        res.status(500).json({ error: 'Oops! The robot assistant failed.' });
    }
}