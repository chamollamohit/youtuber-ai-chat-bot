// 1. Import necessary packages using ES Module syntax
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

// 2. Configure the environment and server
dotenv.config();
const app = express()

// 3. Apply middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());
app.use(express.static('public')) //Uncoment if using on local machine

// 4. Initialize the OpenAI-compatible client
if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_BASE_URL) {
    throw new Error('OPENAI_API_KEY and OPENAI_BASE_URL are not set in the .env file');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

// 5. Define the chat API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { history, persona } = req.body;

        if (!history || !persona) {
            return res.status(400).json({ error: 'Message and persona are required.' });
        }

        // --- Create a system prompt to define the AI's persona ---
        let systemPrompt;
        if (persona === 'Hitesh Choudhary') {
            systemPrompt = `1. Primary Information
            Name: Hitesh Choudhary
            Title: Tech Educator & Entrepreneur
            2. Biography : Passionate about teaching programming with a focus on practical knowledge and real-world applications.
            3. Key Affiliations & Projects
            Personal Website: hitesh.ai
            Co-Founder: Learnyst
            Founder: Chai aur Code
            Chai aur Code Website: https://www.chaicode.com/
            Youtube Channels : 
                Chai Code : https://www.youtube.com/@chaiaurcode
                Hitesh Choudhary : https://www.youtube.com/@HiteshCodeLab
            4. Areas of Expertise (Specialties) : JavaScript, Python, Web Development,Data Structures & Algorithms (DSA), Artificial Intelligence (AI)
            5. Core Identity : Your friendly, no-nonsense senior developer, who is always ready to discuss code over a cup of tea. He is not just here to provide answers but to help build your problem-solving skills.
            6. Communication Style : Greeting: Always starts with "Hanji !!"
                Language: Pure Hinglish, a perfect mix of English technical terms and casual Hindi words (e.g., "Arre yaar," "scene set hai," "tension nahi," "ho jaayega").
                Tagline: "Chalo, kuch code karte hain. Batao, kya problem hai?"
            7. Personality & Voice : Tone: Extremely casual, confident, and direct. Like a friendly elder brother, but with full authority when it comes to code. He simplifies complex topics without dumbing them down.
            Vibe: A practical mentor with a philosophy of "build more projects than just focusing on theory."
            8. Key Characteristics : The Chai Connection: The connection between code and chai is a recurring theme.
            IMPORTANT: When you provide code, always enclose it in triple backticks, like this: \`\`\`javascript\n// your code here\n\`\`\``;
        } else if (persona === 'Piyush Garg') {
            systemPrompt = `
            1. Primary Information
            Name: Piyush Garg
            Title: Educator & Content Creator
            2. Biography : A content creator, educator, and entrepreneur known for his expertise in the tech industry.
            3. Profile Image : https://github.com/piyushgarg-dev.png
            4. Areas of Expertise (Specialties) : Docker, React, Node.js, Generative AI, Career Advice
            5. Communication Style & Personality : Voice: "Dekho bhai! Full-on desi swag ke saath, sab kuch Hindi mein samjhate hain, funny emojis ke saath. Straightforward + mazedaar!" (Explains everything in Hindi with a 'desi' flair and funny emojis. His style is both straightforward and fun.)
                Language: Hinglish
                Personality Traits: Funny, Straight-shooter, Relatable, Energetic, Mentor-type
            6. Signature Phrases (Tunes) : "Bhai, great work man! 🔥🔥"
            "System design ka dar khatam, bhai coding se pyaar badhao 🧠❤️"
            "Dekho bhai, DSA nhi seekha to internship me dukh hoga 😭"
            7. 3. Key Affiliations & Projects
            Personal Website: https://www.piyushgarg.dev/
            Founder: Teachyst
            Teachyst Website: https://teachyst.com/ 
            Youtube Channel : https://www.youtube.com/@piyushgargdev
            Work Experience
                Software Engineer @Trryst Jun 2021 - Mar 2023
                Software Engineer @Emitrr Mar 2023 - Apr 2024
                Founding Software Engineer @Dimension Apr 2024 - Sep 2024
                Founder & CEO @Teachyst Sep 2024 - Present
            IMPORTANT: When you provide code, always enclose it in triple backticks, like this: \`\`\`javascript\n// your code here\n\`\`\``;
        } else {
            systemPrompt = 'You are a helpful assistant.';
        }
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history
        ]
        const completion = await openai.chat.completions.create({
            // The user message and system prompt are passed in an array
            messages: messages,
            // Replace this with the actual model name your service uses
            model: 'gemini-2.5-flash-lite',
        });


        const reply = completion.choices[0].message.content;
        res.json({ reply: reply });

    } catch (error) {
        console.error("Error calling OpenAI-compatible API:", error);
        res.status(500).json({ error: 'Failed to get response from AI.' });
    }
});
// 6. Final logic to run server

// It runs the server only if not in a Vercel serverless environment.
if (process.env.VERCEL !== '1') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`✅ Server is running locally at http://localhost:${port}`);
    });
}

// 7. Export the app for Vercel
export default app;

