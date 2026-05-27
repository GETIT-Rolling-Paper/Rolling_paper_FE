const BASE_URL = "http://localhost:8080/api/messages";

// 전체 메시지 조회
export const getMessages = async () => {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("메시지 목록을 불러오지 못했습니다.");
    }

    return response.json();
};

// 메시지 작성
export const createMessage = async ({ content, nickname, password }) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
            nickname,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("메시지 작성에 실패했습니다.");
    }

    return response.json();
};

// 메시지 수정
// 백엔드에 PATCH /api/messages/:id API가 추가되면 바로 연결 가능
export const updateMessage = async (id, { content, nickname, password }) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
            nickname,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("메시지 수정에 실패했습니다.");
    }

    return response.json();
};

// 메시지 삭제
export const deleteMessage = async (id, password) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("메시지 삭제에 실패했습니다.");
    }

    return response.json();
};