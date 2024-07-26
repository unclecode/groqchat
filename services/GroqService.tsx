// @ts-nocheck
// groqchat/services/GroqService.ts
import { Groq } from "groq-sdk";
import StorageService from "./StorageService";

class GroqService {
    private groq: Groq;

    constructor() {
        const apiKey = StorageService.getGroqAPIToken();
        if (apiKey) {
            this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        } else {
            console.error("Groq API key not found");
            //   throw new Error('Groq API key not found');
        }
    }

    async getChatCompletion(
        model: string,
        systemPrompt: string,
        messages: { role: "user" | "assistant" | "system"; content: string }[],
        stream?: boolean,
        context?: string
    ) {
        let fullMessages = messages;
        if (systemPrompt !== "") {
            fullMessages = [{ role: "system", content: systemPrompt }, ...messages];
        }

        // check if last message.content is not empty
        if (fullMessages[fullMessages.length - 1].content !== "") {
            // console.log(fullMessages);
            if (context) {
                let lastMessage = fullMessages[fullMessages.length - 1];
                lastMessage.content = `${lastMessage.content} \n\n<contenxt>Please use the following context to anser the above question. (Do not mention using this context in your reply, just reply as you knew this)\n\n ${context}</contenxt>`;
                fullMessages[fullMessages.length - 1] = lastMessage;
            }
            const response = await this.groq.chat.completions.create({
                messages: fullMessages,
                model,
                stream,
                max_tokens: 4000,
            });
            return stream ? response : response.choices[0]?.message?.content || ""
        } else {
            console.error("Last message content is empty");
            return null;
        }
    }
}

export default GroqService;
