import { useState } from "react";

type PerseImageData = {
  eventDetails: any
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setImage(file)
    }
  }

  const handleSubmit = async () => {
    if (!image) {
      alert("画像をセットしてください")
      return
    }

    const formData = new FormData()
    formData.append("image", image)

    try {
      console.log("formDataをapiにPOSTします・・・")
      const res = await fetch("/api/perseImage", {
        method: "POST",
        body: formData
      })
      const data: PerseImageData = await res.json()
      console.log("data", data)

      // if (data) {
      //   // Googleカレンダーに予定を入れる
      //   createGoogleEvent(data.eventDetails)
      // }
    } catch (e) {
      console.error("Googleカレンダーへのイベント作成に失敗しました: ", e)
    }
  }

  const createGoogleEvent = async (eventDetails: any) => {
    try {
      const res = await fetch("/api/calender/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventDetails: {
            ...eventDetails,
            accessToken: "認証後にゲットしたアクセストークン"
          }
        })
      })

      const data = await res.json()
      console.log(data)
    } catch (e) {
      console.error("Googleカレンダーへのイベント作成に失敗しました: ", e)
    }
  }

  return (
    <div>
      <h1>画像から予定を抽出</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
      />
      <button
        disabled={!image}
        onClick={handleSubmit}
      >
        画像を送信して予定を作成
      </button>
    </div>
  );
}
