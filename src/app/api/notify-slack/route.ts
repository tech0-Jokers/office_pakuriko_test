import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

// Slackクライアントの初期化
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { type, request: userRequest, favSnack } = body;

  try {
    let text: string;

    if (type === "like") {
      text = "👍 誰かが「いいね！」ボタンを押しました！";
    } else if (type === "submit") {
      text = `📝 新しい提出がありました：\n要望: ${userRequest}\nお気に入りのお菓子: ${favSnack}`;
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    // Slackにメッセージを送信
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID as string,
      text: text,
    });

    return NextResponse.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return NextResponse.json(
      { message: "Failed to send notification" },
      { status: 500 }
    );
  }
}
