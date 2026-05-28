import { useState } from "react";

import MainTitle from "../components/MainTitle";
import ShareButton from "../components/ShareButton";
import WriteButton from "../components/WriteButton";
import EmptyMessageSection from "../components/EmptyMessageSection";
import WriteModal from "../components/WriteModal";

function Home() {
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 포스트잇 상태
  const [postits, setPostits] = useState([]);

  // 포스트잇 추가
  const addPostit = (newPostit) => {
    // 포스트잇이 생성될 때 -6도 ~ +6도 사이의 랜덤 각도를 한 번만 부여합니다.
    const randomRotate = Math.floor(Math.random() * 13) - 6;

    const postitWithStyle = {
      ...newPostit,
      style: {
        transform: `rotate(${randomRotate}deg)`,
      }
    };

    setPostits([...postits, postitWithStyle]);
  };

  return (
    <div className="container">
      <MainTitle />

      <section className="action-wrapper">
        <ShareButton />
        <WriteButton openModal={() => setIsModalOpen(true)} />
      </section>

      {/* 회색 영역 */}
      <section className="message-board">
        {postits.length === 0 ? (
          <EmptyMessageSection />
        ) : (
          <div className="postit-container">
            {postits.map((postit, index) => (
              // 생성할 때 저장된 고유한 회전 스타일(style)을 적용합니다.
              <div 
                className="postit" 
                key={index}
                style={postit.style}
              >
                <p>{postit.text}</p>
                <span>- {postit.nickname}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 모달 */}
      {isModalOpen && (
        <WriteModal
          title="겟잇"
          closeModal={() => setIsModalOpen(false)}
          addPostit={addPostit}
        />
      )}
    </div>
  );
}

export default Home;