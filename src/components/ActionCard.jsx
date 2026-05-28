function ShareIcon() {
    return (
        <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            aria-hidden="true"
        >
            <g transform="rotate(-45 21 21)">
                <rect
                    x="6.5"
                    y="16"
                    width="16"
                    height="10"
                    rx="5"
                    stroke="#2584F5"
                    strokeWidth="3.6"
                />
                <rect
                    x="19.5"
                    y="16"
                    width="16"
                    height="10"
                    rx="5"
                    stroke="#2584F5"
                    strokeWidth="3.6"
                />
                <path
                    d="M17.5 21H24.5"
                    stroke="#2584F5"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}

function WriteIcon() {
    return (
        <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M25.8 8.7C26.9 7.6 28.7 7.6 29.8 8.7C30.9 9.8 30.9 11.6 29.8 12.7L15.8 26.7L9.4 28.4L11.1 22L25.8 8.7Z"
                stroke="#27A85E"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.6 10.9L27.6 14.9"
                stroke="#27A85E"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.2 28.1L15.8 26.7"
                stroke="#27A85E"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ActionCard({ type, title, description, onClick }) {
    return (
        <button className={`action-card ${type}`} onClick={onClick}>
            <div className="action-icon">
                {type === "share" ? <ShareIcon /> : <WriteIcon />}
            </div>

            <div className="action-text">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

            <span className="action-arrow">&gt;</span>
        </button>
    );
}

export default ActionCard;
