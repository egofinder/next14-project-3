import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.REPLICATE_API_TOKEN!; // Set a default value if the environment variable is undefined

const replicate = new Replicate({
  auth: apiKey,
});

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { prompt } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (apiKey === "") {
      return new NextResponse("Replicate API TOKEN not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial limit reached", { status: 403 });
    }
    // const output = await replicate.run(
    //   "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    //   {
    //     input: {
    //       prompt: prompt,
    //     },
    //   }
    // );
    if (!isPro) {
      await increaseApiLimit();
    }

    const output =
      "https://replicate.delivery/pbxt/niBSYlmfjtTUMSYJ01ZouNuftYfVLnwChgvVVSQqNeFdOnsHB/000000.mp4";

    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
