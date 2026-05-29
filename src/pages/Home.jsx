import { useCallback, useEffect, useState } from "react";
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
    const [sortType, setSortType] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);

            const data = await getMessages();

            const formattedMessages = data.map((message) => ({
                id: message.id,
                content: message.content,
                nickname: message.nickname || "익명",
                createdAt: message.createdAt || new Date().toISOString(),
            }));

            setMessages([...formattedMessages].reverse());
        } catch (error) {
            console.error(error);
            alert("백엔드 서버에서 메시지를 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const pageSize = 8;
    const totalPages = Math.ceil(messages.length / pageSize);
    const pagedMessages = messages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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

    return (
        <main className="page">
            <section className="hero-section">
                <h1>친구의 롤링페이퍼</h1>
                <p>익명으로 마음을 전해보세요.</p>
            </section>

            <section className="action-section">
                <ActionCard
                    type="write"
                    title="롤링페이퍼 작성하기"
                    description="익명으로 마음을 남겨보세요."
                    onClick={handleOpenWriteModal}
                />
            </section>

            {isLoading ? (
                <p className="loading-message">롤링페이퍼를 불러오는 중입니다...</p>
            ) : (
                <>
                    <MessageList
                        messages={pagedMessages}
                        totalCount={messages.length}
                        sortType={sortType}
                        setSortType={setSortType}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                    />

                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    type="button"
                                    className={currentPage === index + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
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
                {isVisible ? "숨기기" : "보기"}
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
                            {isEditMode ? "수정" : "작성"}
                        </span>
                        <h2>{isEditMode ? "마음 수정하기" : "마음 남기기"}</h2>
                        <p>
                            {isEditMode
                                ? "작성했던 롤링페이퍼를 다시 수정해보세요."
                                : "익명이지만 따뜻한 별명으로 마음을 전해보세요."}
                        </p>
                    </div>

                    <button type="button" className="modal-close-button" onClick={onClose}>
                        x
                    </button>
                </div>

                <label className="modal-label">
                    <span>전하고 싶은 말</span>
                    <textarea
                        value={content}
                        placeholder="예: 항상 응원하고 있어!"
                        onChange={(event) => setContent(event.target.value)}
                    />
                </label>

                <label className="modal-label">
                    <span>보여줄 별명</span>
                    <input
                        type="text"
                        value={nickname}
                        placeholder="예: 익명의 감자"
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
                        <span className="modal-badge delete">삭제</span>
                        <h2>롤링페이퍼 삭제하기</h2>
                        <p>작성할 때 입력한 비밀번호가 필요해요.</p>
                    </div>

                    <button type="button" className="modal-close-button" onClick={onClose}>
                        x
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
