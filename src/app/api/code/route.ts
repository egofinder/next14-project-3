import { auth } from "@clerk/nextjs";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
      "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
  },
  {
    role: "model",
    parts: "Ok, I will try to answer in code snippets.",
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

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial limit reached", { status: 403 });
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

    if (!isPro) {
      await increaseApiLimit();
    }

    const response = await result.response;
    const text = response.text();
    return NextResponse.json(text, { status: 200 });
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
