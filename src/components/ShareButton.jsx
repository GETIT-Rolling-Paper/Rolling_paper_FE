function ShareButton() {

  const handleShare = async () => {
    try {
      // 현재 브라우저 창에 떠 있는 주소(URL)를 통째로 가져옵니다.
      const currentUrl = window.location.href;
      
      // 클립보드에 해당 주소를 복사합니다.
      await navigator.clipboard.writeText(currentUrl);
      
      // 복사 성공 알림
      alert("링크가 복사되었습니다! 친구들에게 공유해보세요. 🎉");
    } catch (error) {
      console.error("링크 복사 실패:", error);
      alert("링크 복사에 실패했습니다. 주소창의 링크를 직접 복사해주세요.");
    }
  };

  return (
    <div
      className="action-card share"
      onClick={handleShare}
    >

      <div className="left">

        <div className="icon">
          🔗
        </div>

        <div className="text">
          <h3>롤링페이퍼 공유하기</h3>
          <p>친구들에게 링크를 공유해보세요!</p>
        </div>

      </div>

      <div className="arrow">
        ›
      </div>

    </div>
  );
}

export default ShareButton;