import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.REPLICATE_API_TOKEN!; // Set a default value if the environment variable is undefined

// const replicate = new Replicate({
//   auth: apiKey,
// });

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
    //   "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
    //   {
    //     input: {
    //       model_version: "stereo-melody-large",
    //       prompt: prompt,
    //       duration: 1,
    //     },
    //   }
    // );
    if (!isPro) {
      await increaseApiLimit();
    }

    const output =
      "https://replicate.delivery/pbxt/dZ0OPt03KD75PReKbe5iIzoxeRmlLGgI8ShzAZEjv7nn2CdkA/out.wav";
    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
