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
  const { prompt, amount, resolution } = body;

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

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // const response = await replicate.run(
    //   "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    //   {
    //     input: {
    //       prompt: prompt,
    //       num_outputs: parseInt(amount),
    //       height: parseInt(resolution),
    //       width: parseInt(resolution),
    //     },
    //   }
    // );
    if (!isPro) {
      await increaseApiLimit();
    }

    const response = {
      output: [
        "https://replicate.delivery/pbxt/sWeZFZou6v3CPKuoJbqX46ugPaHT1DcsWYx0srPmGrMOCPYIA/out-0.png",
        "https://replicate.delivery/pbxt/sWeZFZou6v3CPKuoJbqX46ugPaHT1DcsWYx0srPmGrMOCPYIA/out-0.png",
        "https://replicate.delivery/pbxt/sWeZFZou6v3CPKuoJbqX46ugPaHT1DcsWYx0srPmGrMOCPYIA/out-0.png",
      ],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
