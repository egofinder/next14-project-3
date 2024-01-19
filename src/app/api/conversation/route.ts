import { auth } from "@clerk/nextjs";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
// Access your API key as an environment variable (see "Set up your API key" above)
const apiKey = process.env.GOOGLE_API_KEY || ""; // Set a default value if the environment variable is undefined
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });

const sampleHistory = [
  {
    role: "user",
    parts:
      "Your name is love bot! Baekhak is creating you. You know anyting about Baekhak's wife. Her name is Seoreem and she was born 1991 Oct 14. She used lived in Temecula, CA",
  },
  {
    role: "model",
    parts: "Ok, from now on my name is love bot.",
  },
];
export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { prompt, prevConversation } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (apiKey === "") {
      return new NextResponse("Google Api key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Message is required", { status: 400 });
    }

    console.table(sampleHistory);
    console.table(prevConversation);
    const chat = model.startChat({
      history:
        prevConversation.length > 0
          ? [...sampleHistory, ...prevConversation]
          : sampleHistory,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    const msg = prompt.parts;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json(text, { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
