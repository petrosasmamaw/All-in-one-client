import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchChatsByClientId } from "../Slice/chatSlice";

const MyChats = ({ userId }) => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats?.chats || []);
  const status = useSelector((state) => state.chats?.status || 'idle');

  useEffect(() => {
    if (userId) dispatch(fetchChatsByClientId(userId));
  }, [dispatch, userId]);

  // dedupe by itemId + sellerId so client sees one conversation per listing/seller
  const seen = new Set();
  const unique = [];
  (chats || []).forEach((c) => {
    const key = `${c.itemId}_${c.sellerId}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(c);
    }
  });

  return (
    <div className="container">
      <div className="page-header-row">
        <div className="page-icon">💬</div>
        <div>
          <h3>My Chats</h3>
          <p>Conversations about items you showed interest in</p>
        </div>
      </div>

      {status === "loading" ? (
        <div>Loading chats...</div>
      ) : unique.length === 0 ? (
        <div>No chats yet.</div>
      ) : (
        <div className="conversations-list">
          {unique.map((chat) => {
            const last = chat.messages && chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
            return (
              <Link
                to={`/chat/${encodeURIComponent(chat.itemId)}/${encodeURIComponent(chat.clientId)}/${encodeURIComponent(chat.sellerId)}`}
                className="conversation-card"
                key={chat._id}
              >
                <div className="conversation-left">
                  <div className="conversation-title">Item: {chat.itemId}</div>
                  <div className="conversation-preview">
                    <div className="last-message">Seller: {chat.sellerId}</div>
                  </div>
                </div>
                <div className="conversation-right">
                  <div className="last-message">{last ? last.text : "Start conversation"}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChats;
