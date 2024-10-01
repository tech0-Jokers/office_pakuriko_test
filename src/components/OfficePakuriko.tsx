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

// メインコンポーネント
export default function OfficePakuriko() {
  // useStateを使って状態変数を定義（型定義も追加）
  const [request, setRequest] = useState<string>(""); // 要望・意見の入力内容
  const [favSnack, setFavSnack] = useState<string>(""); // 気に入ったお菓子の名前
  const [showThankYou, setShowThankYou] = useState<boolean>(false); // 「ありがとうございます」ダイアログの表示状態
  const [likeMessage, setLikeMessage] = useState<string>(""); // いいねのメッセージ表示

  // 「いいね！」ボタンが押されたときの処理
  const handleLike = async () => {
    try {
      // APIにリクエストを送信
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      });

      // レスポンスが失敗した場合はエラーを投げる
      if (!response.ok) throw new Error("Failed to send like notification");

      // 成功したらメッセージを表示
      setLikeMessage("いいね！を送信しました！");
      setTimeout(() => setLikeMessage(""), 3000); // 3秒後にメッセージを消す
    } catch (error) {
      console.error("Error sending like notification:", error);
      setLikeMessage("送信に失敗しました。");
      setTimeout(() => setLikeMessage(""), 3000); // 3秒後にメッセージを消す
    }
  };

  // フォームの送信ボタンが押されたときの処理
  const handleSubmit = async () => {
    try {
      // APIにリクエストを送信
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "submit", request, favSnack }),
      });

      // レスポンスが失敗した場合はエラーを投げる
      if (!response.ok) throw new Error("Failed to send submission");

      // 送信が成功した場合、フォームをリセットし、「ありがとうございます」ダイアログを表示
      setRequest("");
      setFavSnack("");
      setShowThankYou(true);
    } catch (error) {
      console.error("Error sending submission:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">
        OfficePakuriko
      </h1>

      {/* 説明文 */}
      <p className="text-center text-gray-600 mb-4">
        オフィスでのコミュニケーションを活性化するためのプロジェクトです。
        <br />
        ここにあるお菓子はご自由に食べて頂いて構いません。
        <br />
        ぜひ、あなたの意見をお聞かせください！
      </p>

      {/* 実証実験の目的ダイアログ */}
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

      {/* 「いいね！」ボタン */}
      <Button
        onClick={handleLike}
        className="w-full mb-4 flex items-center justify-center"
      >
        <ThumbsUp className="mr-2 h-4 w-4" /> いいね！
      </Button>

      {/* いいねメッセージの表示 */}
      {likeMessage && (
        <p
          className="text-center text-green-600 mb-4"
          role="status"
          aria-live="polite"
        >
          {likeMessage}
        </p>
      )}

      {/* フォーム：要望や意見を入力するテキストエリア */}
      <Textarea
        placeholder="要望や意見を聞かせてください"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="mb-4"
      />

      {/* フォーム：気に入ったお菓子の名前を入力するインプット */}
      <Input
        type="text"
        placeholder="気に入ったお菓子の名前を教えてください"
        value={favSnack}
        onChange={(e) => setFavSnack(e.target.value)}
        className="mb-4"
      />

      {/* 送信ボタン */}
      <Button
        onClick={handleSubmit}
        disabled={!request && !favSnack} // どちらも未入力の場合はボタンを無効化
        className="w-full"
      >
        送信
      </Button>

      {/* 「ありがとうございます」ダイアログ */}
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
