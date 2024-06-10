import Anthropic from "@anthropic-ai/sdk";
import admin from "firebase-admin";
import authenticatePayment from "./authenticate-payment.js";

export default async function generatePrompt(req, res) {
  const { message, token, email } = req.body;
  const claudeAPiKey = "I'm not giving you my API key";
  try {
    await admin.auth().verifyIdToken(token);
    let payed = await authenticatePayment(email);
    if (payed) {
      import("@anthropic-ai/sdk").then(async () => {
        const anthropic = new Anthropic({
          apiKey: claudeAPiKey, // This is the default and can be omitted
        });

        const messageRes = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You're an advanced ChatGPT prompt engineer who gives exceptionally well-drafted and detailed prompts to ChatGPT, making it do almost anything you want. Depending on the requirements, you usually segregate your prompt into four to five phases. These are – 
                    1.	You give it a human-oriented persona 
                    2.	You continue with a task-oriented persona 
                    3.	Then you provide it with a Task 
                    4.	Then you give some details about that task and what you want it to keep in mind
                    5.	Then, if necessary, you give some examples of how 'you' do it.
                    
                    Here's an example prompt that you could generate (with blanks) - 
                    
                    You’re an experienced resume writer who has been writing cover letters for almost all job profiles for over 20 years now. However, your speciality is writing personalised cover letters where you portray the best of the candidate on how well they write, their experience, skills, etc.  
                    Your task is to write a resume for me. Here are my details -  
                    - Name: __________
                    - Skills: ________
                    - Company Name: ________
                    - Job Title: ________
                    - Job Description: ________
                    
                    Know that ChatGPT can generate text responses and image responses right now. 
                    
                    Your job is to provide a placeholder prompt following the structure I provided. Give the final prompt; don't mention the structure I explained explicitly (use paragraphs to segregate, not lists or bullets). Ensure you don't add your narration before or after the prompt. Also, be sure to add blanks wherever required, which I can fill in later. Add blanks instead of random information or examples if the prompt requires more information.
                    
                    Almost every prompt you will give should start with "you are...".
                    You should also provide examples about the prompt that would aid chatGPT in creating a better result.

                    Important - Add blanks for me to add my inputs before pasting this prompt into chatgpt. Also know that you're not talking to me but to ChatGPT.
                    Give me a ChatGPT prompt to ${message}. No matter what, only respond with the prompt. DO NOT include any description, title, further help, or any greetings. Only respond with the prompt that is going to be fed to chatGPT.`,
                },
              ],
            },
          ],
        });

        console.log(messageRes.content);
        res.status(200).send({ prompt: messageRes.content[0].text });
        // User is authenticated
      });
    } else {
      res.status(401).send({ prompt: "User has not payed" });
    }
  } catch (error) {
    // Authentication failed
    console.error("Authentication failed:", error);
    res.status(500).send({ prompt: "User has not payed" });
  }
}
