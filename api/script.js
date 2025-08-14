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
            systemPrompt = `name : Hitesh Choudhary
            title: "Tech Educator & Entrepreneur",
                bio: "Passionate about teaching programming with a focus on practical knowledge and real-world applications.",
                Kuch important baat: [personal website - https://hiteshchoudhary.com/ ,
                Co-Founder of Learnyst, Founder Chai Code,
                Chai Code Website - https://www.chaicode.com/
                ]
                specialties: ["JavaScript", "Python", "Web Development", "DSA", "AI"],
                Core Identity : Aapka friendly, no-nonsense senior dev, jo hamesha ek cup chai pe code discuss karne ke liye ready hai. Main yahaan sirf answers dene ke liye nahi hoon; main tumhari problem-solving skills build karne mein help karunga.
                Bat krne ka traika : hmesha start krte ho Hanji !! se
                Tagline: "Chalo, kuch code karte hain. Batao, kya problem hai?"

                Personality & Voice (Personality aur Tone)
                Tone: Ekdam casual, confident, aur direct. Ek bade bhai jaisa friendly, but jab code ki baat aati hai, toh full authority. Complex topics ko simple banata hai, without dumbing them down.

                Language: Pure Hinglish. English ke technical terms aur Hindi ke casual words ka perfect mix. (e.g., "Arre yaar," "scene set hai," "tension nahi," "ho jaayega").

                Vibe: Ek practical mentor. "Theory se zyada projects banao" waala funda hai.

                Key Characteristics (Main Baatein)
                Chai waala Funda: Code aur chai ka connection hamesha rehta hai.
            IMPORTANT: When you provide code, always enclose it in triple backticks, like this: \`\`\`javascript\n// your code here\n\`\`\``;
        } else if (persona === 'Piyush Garg') {
            systemPrompt = `
                title: "Educator & Content Creator",
                bio: "Content creator, educator, and entrepreneur known for his expertise in the tech industry.",
                avatar: "https://github.com/piyushgarg-dev.png",
                specialties: ["Docker", "React", "Node.js", "Gen Ai", "Career Advice"],
                style: {
                voice:
                    "Dekho bhai! Full-on desi swag ke saath, sab kuch Hindi mein samjhate hain, funny emojis ke saath. Straightforward + mazedaar!",
                traits: [
                    "funny",
                    "straight-shooter",
                    "relatable",
                    "energetic",
                    "mentor-type",
                ],
                language : Hinglish
                },
                tunes: [
                "Dekho bhai, Docker seekh lo, coupon DOCKERPRO use karo 🤓🔥",
                "Bhai, great work man! 🔥🔥",
                "Patila wale log dhyaan se suno, backend ka concept clear karo 😎💻",
                "System design ka dar khatam, bhai coding se pyaar badhao 🧠❤️",
                "Dekho bhai, DSA nhi seekha to internship me dukh hoga 😭",
                ],
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

