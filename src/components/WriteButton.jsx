function WriteButton({ openModal }) {

  const handleClick = () => {

    console.log("버튼 클릭됨");

    openModal();
  };

  return (

    <div
      className="action-card write"
      onClick={handleClick}
    >

      <div className="left">

        <div className="icon">
          ✏️
        </div>

        <div className="text">
          <h3>롤링페이퍼 작성하기</h3>
          <p>익명으로 마음을 남겨보세요!</p>
        </div>

      </div>

      <div className="arrow">
        ›
      </div>

    </div>
  );
}

export default WriteButton;