import MessageCard from "./MessageCard";

function MessageList({
    messages,
    totalCount,
    searchText,
    setSearchText,
    sortType,
    setSortType,
    onEdit,
    onDelete,
    onLike,
}) {
    return (
        <section className="message-section">
            <div className="message-header">
                <div className="message-title">
                    <div className="chat-icon">•••</div>
                    <h2>나에게 온 롤링페이퍼</h2>
                    <span>{totalCount}</span>
                </div>

                <div className="message-tools">
                    <select
                        value={sortType}
                        onChange={(event) => setSortType(event.target.value)}
                    >
                        <option value="latest">최신순</option>
                        <option value="oldest">오래된순</option>
                    </select>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                        />
                        <span>🔍</span>
                    </div>
                </div>
            </div>

            <div className="message-grid">
                {messages.length === 0 ? (
                    <p className="empty-message">아직 받은 롤링페이퍼가 없습니다.</p>
                ) : (
                    messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            message={message}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onLike={onLike}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default MessageList;