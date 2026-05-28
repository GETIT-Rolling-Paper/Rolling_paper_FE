import { useState } from "react";



function WriteModal({ title, closeModal, addPostit }) {
  const [message, setMessage] = useState("");

  const [nickname, setNickname] = useState("");
  
  const handleSubmit = () => {

  addPostit({
    text: message,
    nickname: nickname || "익명",
  });

  closeModal();
};

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h2 className="modal-title">
          To. {title}
        </h2>

        <textarea
          className="message-input"
          placeholder="따뜻한 메시지를 남겨주세요 :)"

          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          className="nickname-input"
          type="text"
          placeholder="익명 닉네임"

          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <div className="modal-button-group">

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            작성 완료
          </button>

          <button
            className="cancel-btn"
            onClick={closeModal}
          >
            작성 취소하기
          </button>

        </div>

      </div>

    </div>
  );
}

export default WriteModal;