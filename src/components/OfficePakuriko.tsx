"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OfficePakuriko() {
  const [request, setRequest] = useState("");
  const [favSnack, setFavSnack] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [likeMessage, setLikeMessage] = useState("");

  const handleLike = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      });
      if (!response.ok) throw new Error("Failed to send like notification");
      setLikeMessage("いいね！を送信しました！");
      setTimeout(() => setLikeMessage(""), 3000); // 3秒後にメッセージを消す
    } catch (error) {
      console.error("Error sending like notification:", error);
      setLikeMessage("送信に失敗しました。");
      setTimeout(() => setLikeMessage(""), 3000);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "submit", request, favSnack }),
      });
      if (!response.ok) throw new Error("Failed to send submission");
      setRequest("");
      setFavSnack("");
      setShowThankYou(true);
    } catch (error) {
      console.error("Error sending submission:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">
        OfficePakuriko
      </h1>
      <p className="text-center text-gray-600 mb-4">
        オフィスでのコミュニケーションを活性化するためのプロジェクトです。
        <br />
        ここにあるお菓子はご自由に食べて頂いて構いません。
        <br />
        ぜひ、あなたの意見をお聞かせください！
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full mb-4 flex items-center justify-center"
          >
            <Info className="mr-2 h-4 w-4" /> 実証実験の目的
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OfficePakurikoプロジェクトの目的</DialogTitle>
            <DialogDescription>
              オフィスでのコミュニケーションを活性化することを目的としています。
              <br />
              実証実験では、以下の仮説検証を行っています。
              <br />
              １）どんなお菓子が喜ばれるのか
              <br />
              ２）どんなお菓子だとコミュニケーションが活性化するのか
              <br />
              ３）お菓子に支払える金額はどれくらいか
              <br />
              ４）どんな仕組みだと、上記が達成しやすくなるのか
              <br />
              <br />
              上記の検証のために、可能であれば購入意思の金額を投入してもらえると大変助かります。
              <br />
              あなたの意見が、より楽しいオフィスライフの創造に貢献します！
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleLike}
        className="w-full mb-4 flex items-center justify-center"
      >
        <ThumbsUp className="mr-2 h-4 w-4" /> いいね！
      </Button>
      {likeMessage && (
        <p
          className="text-center text-green-600 mb-4"
          role="status"
          aria-live="polite"
        >
          {likeMessage}
        </p>
      )}

      <Textarea
        placeholder="要望や意見を聞かせてください"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="mb-4"
      />

      <Input
        type="text"
        placeholder="気に入ったお菓子の名前を教えてください"
        value={favSnack}
        onChange={(e) => setFavSnack(e.target.value)}
        className="mb-4"
      />

      <Button
        onClick={handleSubmit}
        disabled={!request && !favSnack}
        className="w-full"
      >
        送信
      </Button>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ありがとうございます！</DialogTitle>
            <DialogDescription>
              コメントありがとうございます！嬉しいです！
              あなたの意見は、より良いオフィス環境づくりに役立ちます。
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowThankYou(false)}>閉じる</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
