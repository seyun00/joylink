import React, { useState } from "react";
import ChattingModal from "../chattingModal";

export default function MyInfo() {
  
  const [chattingDisplay, setChattingDisplay] = useState("Close");
  const handleCloseChatting = () => {
    setChattingDisplay("Close");
  };
  
  return (
    <div>
      <div>
        <div className="border-indigo-800 p-2 border-2 rounded-lg ... m-3 bg-gray-100">
          <h2>내 정보</h2><br></br><br></br>
          <button className="m-2">Club Management</button>
        </div>
        <div className="border-indigo-800 p-2 border-2 rounded-lg ... m-3
        bg-gray-100">
          <button onClick={() => setChattingDisplay("Open")} >채팅</button>
        </div>
        <div className="border-indigo-800 p-2 border-2 rounded-lg ... m-3 bg-gray-100">
          <button>장부</button>
        </div>
        <div className="border-indigo-800 p-2 border-2 rounded-lg ... m-3 bg-gray-100">
          <h3>카테고리</h3><br></br><br></br>
          <div className="flex flex-col">
            <button className="">갤러리</button>
            <button className="">동아리 공지사항</button>
            <button className="">자유게시판</button>
            <button className="">질문게시판</button>
          </div>
        </div>
      </div>

      {chattingDisplay === "Open" && <ChattingModal handleCloseChatting={handleCloseChatting} />}
    </div>
  );
}

