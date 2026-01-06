import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchChatByItemClientSeller, createChat } from '../Slice/chatSlice'

const Chat = ({ userId }) => {
  const { itemId: paramItemId, clientId: paramClientId, sellerId: paramSellerId } = useParams()
  const itemId = paramItemId
  const clientId = paramClientId || userId
  const sellerId = paramSellerId
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [chat, setChat] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!itemId || !clientId || !sellerId) return
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await dispatch(fetchChatByItemClientSeller({ itemId, clientId, sellerId }))
        if (mounted && res.payload) setChat(res.payload)
      } catch (err) {
        // no existing chat; keep chat as null
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [itemId, clientId, sellerId, dispatch])

  const handleSend = async () => {
    if (!message.trim()) return
    const payload = { itemId, clientId, sellerId, message: message.trim(), senderId: clientId }
    const res = await dispatch(createChat(payload))
    if (res.payload) setChat(res.payload)
    setMessage('')
  }

  if (!itemId || !clientId || !sellerId) {
    return (
      <div className="container">
        <h3>Invalid chat parameters</h3>
        <p>Please open chat from a product or profile.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header-row">
        <div className="page-icon">💬</div>
        <div>
          <h3 style={{ margin: 0 }}>Chat</h3>
          <p className="muted" style={{ margin: 0 }}>Item: {itemId} • Seller: {sellerId}</p>
        </div>
      </div>

      <div className="chat-list" style={{ marginTop: 12 }}>
        <div className="chat-header">Conversation</div>
        <div className="chat-messages">
          {loading && <div className="muted">Loading...</div>}
          {!loading && (!chat || !chat.messages || chat.messages.length === 0) && (
            <div className="muted">No messages — start the conversation.</div>
          )}
          {chat && chat.messages && chat.messages.map((m, idx) => (
            <div key={idx} className={`chat-message ${m.senderId === clientId ? 'me' : ''}`}>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{m.senderId === clientId ? 'You' : 'Seller'}</div>
              <div>{m.text}</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>{new Date(m.createdAt || m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          />
          <button className="btn chat" onClick={handleSend}>Send</button>
          <button className="btn" onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default Chat
