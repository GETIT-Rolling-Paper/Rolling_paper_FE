import { useEffect, useMemo, useState } from "react";
import ActionCard from "../components/ActionCard";
import MessageList from "../components/MessageList";
import {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
} from "../api/postApi";

function Home() {
    const [messages, setMessages] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const loadMessages = async () => {
        try {
            setIsLoading(true);

            const data = await getMessages();

            const formattedMessages = data.map((message) => ({
                id: message.id,
                content: message.content,
                nickname: message.nickname || "익명",
                color: message.color || "yellow",
                isLiked: false,
                createdAt: message.createdAt || new Date().toISOString(),
            }));

            setMessages([...formattedMessages].reverse());
        } catch (error) {
            console.error(error);
            alert("백엔드 서버에서 메시지를 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const filteredMessages = useMemo(() => {
        return messages.filter((message) =>
            message.content.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [messages, searchText]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("롤링페이퍼 링크가 복사되었습니다!");
        } catch {
            alert("링크 복사에 실패했습니다.");
        }
    };

    const handleOpenWriteModal = () => {
        setEditingMessage(null);
        setIsWriteModalOpen(true);
    };

    const handleOpenEditModal = (id) => {
        const targetMessage = messages.find((message) => message.id === id);

        if (!targetMessage) return;

        setEditingMessage(targetMessage);
        setIsWriteModalOpen(true);
    };

    const handleCloseWriteModal = () => {
        setEditingMessage(null);
        setIsWriteModalOpen(false);
    };

    const handleSubmitMessage = async ({ content, nickname, color, password }) => {
        if (content.trim() === "") {
            alert("메시지를 입력해주세요.");
            return;
        }

        if (nickname.trim() === "") {
            alert("별명을 입력해주세요.");
            return;
        }

        if (!/^\d{4}$/.test(password)) {
            alert("비밀번호는 숫자 4자리로 입력해주세요.");
            return;
        }

        try {
            if (editingMessage) {
                await updateMessage(editingMessage.id, {
                    content,
                    nickname,
                    password,
                });

                alert("메시지가 수정되었습니다.");
            } else {
                await createMessage({
                    content,
                    nickname,
                    color,
                    password,
                });

                alert("롤링페이퍼가 작성되었습니다.");
            }

            await loadMessages();
            handleCloseWriteModal();
        } catch (error) {
            console.error(error);

            if (editingMessage) {
                alert("메시지 수정에 실패했습니다. 비밀번호 또는 백엔드 API를 확인해주세요.");
            } else {
                alert("메시지 작성에 실패했습니다. 백엔드 서버를 확인해주세요.");
            }
        }
    };

    const handleOpenDeleteModal = (id) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteTargetId(null);
        setIsDeleteModalOpen(false);
    };

    const handleSubmitDelete = async (password) => {
        if (!/^\d{4}$/.test(password)) {
            alert("비밀번호는 숫자 4자리로 입력해주세요.");
            return;
        }

        const isDelete = window.confirm("정말 삭제하시겠습니까?");

        if (!isDelete) return;

        try {
            await deleteMessage(deleteTargetId, password);

            await loadMessages();
            handleCloseDeleteModal();
            alert("메시지가 삭제되었습니다.");
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다. 비밀번호 또는 백엔드 서버를 확인해주세요.");
        }
    };

    const handleLike = (id) => {
        const likedMessages = messages.map((message) =>
            message.id === id
                ? {
                    ...message,
                    isLiked: !message.isLiked,
                }
                : message
        );

        setMessages(likedMessages);
    };

    return (
        <main className="page">
            <section className="hero-section">
                <div className="hero-title">
                    <img src="/GETIT_LOGO.png" alt="GETIT 로고" className="hero-logo" />
                    <div className="hero-text">
                        <span className="hero-label">GETIT</span>
                        <h1>롤링페이퍼</h1>
                    </div>
                </div>
                <p>익명으로 마음을 전해보세요! 💙</p>
            </section>

            <section className="action-section">
                <ActionCard
                    type="share"
                    title="롤링페이퍼 공유하기"
                    description="친구들에게 링크를 공유해보세요!"
                    onClick={handleShare}
                />

                <ActionCard
                    type="write"
                    title="롤링페이퍼 작성하기"
                    description="익명으로 마음을 남겨보세요!"
                    onClick={handleOpenWriteModal}
                />
            </section>

            {isLoading ? (
                <p className="loading-message">롤링페이퍼를 불러오는 중입니다...</p>
            ) : (
                <MessageList
                    messages={filteredMessages}
                    totalCount={messages.length}
                    searchText={searchText}
                    setSearchText={setSearchText}

                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onLike={handleLike}
                />
            )}

            {isWriteModalOpen && (
                <MessageFormModal
                    mode={editingMessage ? "edit" : "create"}
                    initialMessage={editingMessage}
                    onClose={handleCloseWriteModal}
                    onSubmit={handleSubmitMessage}
                />
            )}

            {isDeleteModalOpen && (
                <DeletePasswordModal
                    onClose={handleCloseDeleteModal}
                    onSubmit={handleSubmitDelete}
                />
            )}
        </main>
    );
}

function PasswordInput({ value, onChange, placeholder }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="password-input-box">
            <input
                type={isVisible ? "text" : "password"}
                value={value}
                maxLength="4"
                placeholder={placeholder}
                onChange={(event) => {
                    const onlyNumber = event.target.value.replace(/[^0-9]/g, "");
                    onChange(onlyNumber);
                }}
            />

            <button
                type="button"
                className="password-eye-button"
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
                {isVisible ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M10.7 10.7A2 2 0 0 0 13.3 13.3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M9.5 5.5A9.8 9.8 0 0 1 12 5C17 5 20.5 9 22 12C21.4 13.2 20.5 14.5 19.3 15.6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6.2 6.7C4.2 8 2.8 10.1 2 12C3.5 15 7 19 12 19C13.4 19 14.7 18.7 15.8 18.1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M2 12C3.5 9 7 5 12 5C17 5 20.5 9 22 12C20.5 15 17 19 12 19C7 19 3.5 15 2 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}

const COLOR_OPTIONS = [
    { label: "노랑", value: "yellow", hex: "#fff3a3" },
    { label: "핑크", value: "pink",   hex: "#ffd6e0" },
    { label: "파랑", value: "blue",   hex: "#d0e8ff" },
    { label: "초록", value: "green",  hex: "#d4f5e2" },
];

function MessageFormModal({ mode, initialMessage, onClose, onSubmit }) {
    const [content, setContent] = useState(initialMessage?.content || "");
    const [nickname, setNickname] = useState(initialMessage?.nickname || "");
    const [password, setPassword] = useState("");
    const [color, setColor] = useState(initialMessage?.color || "yellow");

    const isEditMode = mode === "edit";

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            content,
            nickname,
            color,
            password,
        });
    };

    return (
        <div className="modal-backdrop">
            <form className="message-modal" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <div>
                        <span className="modal-badge">
                            {isEditMode ? "Edit Letter" : "New Letter"}
                        </span>
                        <h2>{isEditMode ? "마음 수정하기" : "마음 남기기"}</h2>
                        <p>
                            {isEditMode
                                ? "작성했던 롤링페이퍼를 다시 다듬어보세요."
                                : "익명이지만, 따뜻한 별명으로 마음을 전해보세요."}
                        </p>
                    </div>

                    <button type="button" className="modal-close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <label className="modal-label">
                    <span>전하고 싶은 말</span>
                    <textarea
                        value={content}
                        placeholder="예: 항상 응원하고 있어! 너의 하루가 조금 더 따뜻했으면 좋겠어."
                        onChange={(event) => setContent(event.target.value)}
                    />
                </label>

                <label className="modal-label">
                    <span>보여줄 별명</span>
                    <input
                        type="text"
                        value={nickname}
                        placeholder="예: 익명의 고양이, 파란 감자, 지나가던 선배"
                        onChange={(event) => setNickname(event.target.value)}
                    />
                </label>

                <div className="modal-label">
                    <span>포스트잇 색상</span>
                    <div className="color-options">
                        {COLOR_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`color-circle ${color === option.value ? "selected" : ""}`}
                                style={{ background: option.hex }}
                                onClick={() => setColor(option.value)}
                                title={option.label}
                            />
                        ))}
                    </div>
                </div>

                <label className="modal-label">
                    <span>수정/삭제용 비밀번호</span>
                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        placeholder="숫자 4자리"
                    />
                </label>

                <div className="modal-button-group">
                    <button type="button" className="modal-cancel-button" onClick={onClose}>
                        취소
                    </button>
                    <button type="submit" className="modal-submit-button">
                        {isEditMode ? "수정 완료" : "롤링페이퍼 등록"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function DeletePasswordModal({ onClose, onSubmit }) {
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="modal-backdrop">
            <form className="message-modal small" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <div>
                        <span className="modal-badge delete">Delete Letter</span>
                        <h2>롤링페이퍼 삭제하기</h2>
                        <p>작성할 때 입력한 비밀번호가 필요해요.</p>
                    </div>

                    <button type="button" className="modal-close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <label className="modal-label">
                    <span>비밀번호</span>
                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        placeholder="숫자 4자리"
                    />
                </label>

                <div className="modal-button-group">
                    <button type="button" className="modal-cancel-button" onClick={onClose}>
                        취소
                    </button>
                    <button type="submit" className="modal-delete-button">
                        삭제하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Home;