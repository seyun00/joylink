import { useEffect, useState, useTransition, useRef } from "react";
import { supabase } from '../App';

export default function MessageModal(props) {
  // 메시지 모달창 닫기
  const handleCloseMessage = props.handleCloseMessage;

  // 받은 쪽지, 보낸 쪽지 버튼
  const [messageBtn, setMessageBtn] = useState("Received");
  const inputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");
  const [searchbyTitle, setSerachByTitle] = useState("");

  // 받은 쪽지, 보낸 쪽지 list 변수
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [sentMessage, setSentMessage] = useState([]);

  // 쪽지 페이지를 저장하는 배열
  const [receivedPage, setReceivedPage] = useState([]);
  const [sentPage, setSentPage] = useState([]);

  const [userseq, setUserSeq] = useState("");

  // 쪽지 리스트 전체 체크박스 상태
  const [receivedCheckbox, setReceivedCheckbox] = useState(false)
  const [sentCheckbox, setSentCheckbox] = useState(false)

  // 현재 페이지의 상태가 저장되어 있는 변수, 기본값 : 1 페이지
  const [currentReceivedPage, setCurrentReceivedPage] = useState(1)
  const [currentSentPage, setCurrentSentPage] = useState(1)


  //  전체 checkbox 제어
  const toggleAllCheckboxes = (isChecked, messageType) => {
    // 해당 타입의 모든 쪽지의 상태를 업데이트하는 로직
    const updateFunc = messageType === "Received" ? setReceivedCheckbox : setSentCheckbox;
    updateFunc(isChecked);
    // 각 쪽지에 대해 handleCheckboxChange 호출
    const messages = messageType === "Received" ? receivedMessage : sentMessage;
    messages.forEach(msg => {
      const fakeEvent = { target: { checked: isChecked } };
      handleCheckboxChange(fakeEvent, msg.msg_seq);
    });
  };

  // 페이지 버튼 클릭 시 현재 페이지의 상태 전환
  const handlePageBtn = (messageType, page) => {
    if (messageType === "Received") setCurrentReceivedPage(page); console.log(page)
    if (messageType === "Sent") setCurrentSentPage(page); console.log(page)
  }

  // 쪽지 읽음표시
  async function updateMessageReadState(target) {
    // 받은쪽지의 읽음표시
    if (messageBtn == 'Received') {
      await supabase.from('messages').update('').eq(`msg_seq`, target);
    }
  }
  //  쪽지 삭제여뷰 (실제 DB는 아니고 상태만 Check)
  async function updateMessageDeleteState(target) {
    // 받은쪽지에서 삭제시
    if (messageBtn == 'Received') {
      await supabase.from('messages').update('rcv_deleted').eq(`msg_seq`, target);
    }
    // 보낸 쪽지에서 삭제 시
    else {
      await supabase.from('messages').update('snd_deleted').eq(`msg_seq`, target);
    }
  }

  // 메시지에 checkbox 처리 
  function handleMessageCheckbox(target) {
    // const {data, error} = await supabase.from('messages')

    console.log(target);

  }

  // 받은쪽지 목록 Update
  const fetchReceivedMessages = async () => {
    const { data, error } = await supabase.from('messages').select(`
      msg_seq,
      msg_snd_seq,
      msg_rcv_seq,
      msg_title,
      msg_body,
      msg_send_time,
      users : msg_snd_seq (
        user_name
      )
    `).eq(`msg_rcv_seq`, 13)
      .eq(`rcv_deleted`, false)

    if (error) {
      console.error("받은 쪽지 select query 에러", error);
    } else {
      console.log('받은 데이터', data);
      setReceivedMessage(data);

    }
  };

  useEffect(() => {
    // 받은 쪽지 페이지 개수 계산해서 배열로 저장
    let count = (Math.floor((receivedMessage.length - 1) / 5) + 1);
    let list = [];
    for (let i = 1; i <= count; i++) {
      list.push(i);
    }
    setReceivedPage(list);
  }, [receivedMessage])

  // 컴포넌트가 마운트될 때 받은 쪽지를 로드 (1회수행)
  useEffect(() => {
    fetchReceivedMessages();
  }, []);

  const handleSentMessage = async () => {
    // 함수명 :fetchSntData()
    // 기  능 :DB에서 내가 보낸쪽지 가져오기
    // 여기서 13은 임의로 보낸사람 seq저장한것
    const { data, error } = await supabase.from('messages').select(`
      msg_seq,
      msg_snd_seq,
      msg_rcv_seq,
      msg_title,
      msg_body,
      msg_send_time,
      users : msg_rcv_seq (
        user_name
      )
    `).eq(`msg_snd_seq`, 13)
      .eq(`snd_deleted`, false)
    if (error) {
      console.error("보낸쪽지 select query 에러");
    }
    console.log('보낸 데이터', data);
    setSentMessage(data);

    // 보낸 쪽지 페이지 개수 계산해서 배열로 저장
    let count = (Math.floor((data.length - 1) / 5) + 1);
    let list = [];
    for (let i = 1; i <= count; i++) {
      list.push(i);
    }
    setSentPage(list);
    setMessageBtn("Sent");
  }

  const handleReceivedMessage = async () => {

    // 여기서 처음 들어왔을때 data를 미리 저장해두고, 
    // 함수명 :fetchRcvData()
    // 기  능 :DB에서 내가 받은쪽지 가져오기
    // 여기서 1은 임의로 받은사람 저장한것
    const { data, error } = await supabase.from('messages').select(`
      msg_seq,
      msg_snd_seq,
      msg_rcv_seq,
      msg_title,
      msg_body,
      msg_send_time,
      users : msg_snd_seq (
        user_name
      )
    `).eq(`msg_rcv_seq`, 13)
      .eq(`rcv_deleted`, false)

    if (error) {
      console.error("받은 쪽지 select query 에러");
    }
    console.log('받은 데이터', data);
    setReceivedMessage(data);

    setMessageBtn("Received")
  }

  // 쪽지 검색 기능
  const handleSearchbyTitle = async () => {
    const currentInputValue = inputRef.current.value;
    setTitle(currentInputValue);
    console.log("현재 메시지 버튼 상태", messageBtn);
    console.log("현재 검색어 : ", currentInputValue);
    if (messageBtn === "Received") {
      const { data, error } = await supabase.from('messages').select(`
      msg_seq,
      msg_snd_seq,
      msg_rcv_seq,
      msg_title,
      msg_body,
      msg_send_time,
      users : msg_snd_seq (
        user_name
      )
    `).eq(`msg_rcv_seq`, 13)
        .eq(`rcv_deleted`, false)
        .like('msg_title', `%${currentInputValue}%`);
      console.log("데이터", data);
      setReceivedMessage(data);
    }
    else {
      console.log("여기는 왔나?");
      const { data, error } = await supabase.from('messages').select(`
      msg_seq,
      msg_snd_seq,
      msg_rcv_seq,
      msg_title,
      msg_body,
      msg_send_time,
      users : msg_rcv_seq (
        user_name
      )
    `).eq(`msg_snd_seq`, 13)
        .eq(`snd_deleted`, false)
        .like('msg_title', `%${currentInputValue}%`);
      console.log("데이터", data);
      setSentMessage(data);
    }
  }

  //
  const handleCheckboxChange= (event, messageId)=> {
    if (event.target.checked) {
      console.log(`Checkbox with message ID ${messageId} is checked.`);
      // 여기에 추가적인 로직을 실행할 수 있습니다.
    } else {
      console.log(`Checkbox with message ID ${messageId} is unchecked.`);
      // 체크 해제 상태에 대한 로직을 실행할 수 있습니다.
    }
  }

  // 쪽지 쓰기 버튼
  const [messageWriteBtn, setMessageWriteBtn] = useState("List")

  const handleMessageWrite = () => {
    setMessageWriteBtn(messageWriteBtn == "List" ? "Write" : "List")
  }

  // 쪽지 전송 버튼
  const handleMessageSend = async () => {
    const { data, error } = await supabase.from('messages').insert({
      'msg_title': title,
      'msg_body': content,
      'msg_rcv_seq': receiver,
      'msg_snd_seq': 13
    })

    // 전송쪽 다시 초기화
    setTitle("");
    setContent("");
    setReceiver("");

    if (error) {
      console.error(error);
    }
    console.log(data);
    alert("쪽지 전송이 완료되었습니다.")
    //쪽지 리스트로 돌아가기
    handleMessageWrite();
  }

  // 쪽지 쓸때 보낼꺼
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handlereceiverChange = (event) => {
    setReceiver(event.target.value);
  };
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // 쪽지 리스트
  const MessageListContents = () => {
    return (
      <>
        <div>

          {/* 리스트 상단 */}
          <div className='flex p-2 mb-4 border-2'>
            {messageBtn == "Received" && <input type="checkbox" onChange={(e) => toggleAllCheckboxes(e.target.checked, "Received")} checked={receivedCheckbox} />}
            {messageBtn == "Sent" && <input type="checkbox" onChange={(e) => toggleAllCheckboxes(e.target.checked, "Sent")} checked={sentCheckbox} />}
            <div className='flex justify-center w-full mx-2'>
              <p>
                {messageBtn == "Received" && "보낸 사람"}
                {messageBtn == "Sent" && "받은 사람"}
              </p>
              <p className='mx-48'>제목</p>
              <p>날짜</p>
            </div>
          </div>
          {/* // 받은쪽지 보는곳 */}
          {messageBtn === "Received" &&
            <div className="text-center">
              <div className='mb-1 border-2'>
                {receivedMessage.length > 0 ? (
                  // 현재 페이지의 5개 쪽지 정보 표시
                  receivedMessage.slice((currentReceivedPage - 1) * 5, currentReceivedPage * 5).map((msg, index) => (
                    <div key={index} className='flex items-center p-2 mb-4'>
                      <input type="checkbox" checked={messageBtn === "Received" ? receivedCheckbox : sentCheckbox} id={msg.msg_seq} onChange={(e) => handleCheckboxChange(e, msg.msg_seq)}/>                      <div className='flex justify-between w-full mx-2'>
                        <div className="flex items-center">
                          <p className='inline-block ml-1 text-center w-28'>{msg.users.user_name}</p>
                          <a href='#' className='ml-2'>{msg.msg_title}</a>
                        </div>
                        <p className='w-20 text-sm'>{msg.msg_send_time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>받은 쪽지가 없습니다.</p>
                )}
              </div>

              {/* 하단에 페이지 버튼 표시 */}
              <div>
                {receivedPage.map((page, index) => (
                  <button key={index}
                    className={`mx-1 ${page === currentReceivedPage ? 'text-black' : 'text-[#c9c9c9]'}`}
                    onClick={() => handlePageBtn("Received", page)}>
                    {page}
                  </button>
                ))}
              </div>
            </div>
          }

          {/* // 보낸쪽지 보는곳 */}
          {messageBtn === "Sent" &&
            <div className="text-center">
              <div className='mb-1 border-2'>
                {sentMessage.length > 0 ? (
                  // 현재 페이지의 5개 쪽지 정보 표시
                  sentMessage.slice((currentSentPage - 1) * 5, currentSentPage * 5).map((msg, index) => (
                    <div key={index} className='flex items-center p-2 mb-4'>
                      <input type="checkbox" defaultChecked={sentCheckbox} onChange={(e) => handleCheckboxChange(e, msg.msg_seq)} />
                      <div className='flex justify-between w-full mx-2'>
                        <div className="flex items-center">
                          <p className='inline-block ml-1 text-center w-28'>{msg.users.user_name}</p>
                          <a href='#' className='ml-2'>{msg.msg_title}</a>
                        </div>
                        <p className='w-20 text-sm'>{msg.msg_send_time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>보낸 쪽지가 없습니다.</p>
                )}
              </div>

              {/* 하단에 페이지 버튼 표시 */}
              <div>
                {sentPage.map((page, index) => (
                  <button key={index}
                    className={`mx-1 ${page === currentSentPage ? 'text-black' : 'text-[#c9c9c9]'}`}
                    onClick={() => handlePageBtn("Sent", page)}>
                    {page}
                  </button>
                ))}
              </div>
            </div>
          }

        </div>
      </>
    )
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchbyTitle();
    }
  };

  // 쪽지 리스트 화면
  const MessageList = () => {
    return (
      <div id='message_list'>

        {/* 상단 버튼 */}
        <div className='flex justify-between mb-4'>
          <span className='p-1 border-2'>
            <button className='mx-4' onClick={handleReceivedMessage}>받은 쪽지</button>
            <button className='mx-4' onClick={handleSentMessage}>보낸 쪽지</button>
          </span>
          <button onClick={handleMessageWrite} className='p-1 border-2'>쪽지 쓰기</button>
        </div>

        {/* 검색창 */}
        <div className='flex justify-end mb-4'>
          <input className='px-1 border-2' id="searchbyTitle" onKeyDown={handleKeyDown} type="text" placeholder='제목 검색' ref={inputRef} />
          <button className='px-1 ml-2 border-2' onClick={handleSearchbyTitle} id="searchButton">검색</button>
        </div>

        {/* 쪽지 리스트  */}
        <MessageListContents />

        {/* 하단 버튼 */}
        <div className='flex justify-end'>
          <button className='p-1 px-3 mr-1 border-2'>삭제</button>
          <button className='p-1 px-3 border-2' onClick={handleCloseMessage}>닫기</button>
        </div>
      </div>
    )
  }

  // 쪽지 쓰기 화면
  const MessageWrite = () => {
    return (
      <>
        <div id='message_write' className='p-1 border-2'>

          <div>
            <div className='py-2'>
              <label htmlFor="message_write_title"><p className='inline-block text-center w-28'>제목</p></label>
              <input id='message_write_title' type="text" className='border-2' style={{ width: '450px' }} onChange={() => handleTitleChange} />
            </div>
            <div className='py-2'>
              <label htmlFor="message_write_receiver"><p className='inline-block text-center w-28'>받는 사람</p></label>
              <input id='message_write_receiver' type="text" className='border-2' style={{ width: '450px' }} onChange={() => handlereceiverChange} />
            </div>
            <div className='flex py-2 '>
              <label htmlFor="message_write_content"><p className='inline-block text-center w-28'>내용</p></label>
              <textarea id="message_write_content" className='border-2 resize-none' style={{ width: '450px', height: '300px' }} onChange={() => handleContentChange}></textarea>
            </div>
          </div>

          <div className='flex justify-end'>
            <button className='p-1 px-3 mr-1 border-2' onClick={handleMessageSend}>전송</button>
            <button className='p-1 px-3 border-2' onClick={handleMessageWrite}>목록</button>
          </div>

        </div>
      </>
    )
  }

  return (
    <>
      <div id="mypage_message" className='fixed inset-0 p-4 m-auto bg-white border border-black border-solid' style={{ width: '650px', height: '650px' }} >
        <h1 className='mb-4' >쪽지</h1>

        {messageWriteBtn == "List" &&
          <MessageList />
        }
        {messageWriteBtn == "Write" &&
          <MessageWrite />
        }
      </div>
    </>
  )
}