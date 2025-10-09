"use client"

import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { getConversations, getConversation, sendMessage, getUser, getListing, Conversation, Message } from "@/lib/api"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, User as UserIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function MessagesPage() {
  const { t } = useLanguage()
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasProcessedUrlParams = useRef(false)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [loadingNewConversation, setLoadingNewConversation] = useState(false)
  const [listingId, setListingId] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return
    }
    
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    
    // Always fetch conversations first
    if (!hasProcessedUrlParams.current) {
      hasProcessedUrlParams.current = true
      
      fetchConversations().then((convos) => {
        // Check if there's a userId in the URL (for starting new conversation)
        const userIdParam = searchParams.get('userId')
        const listingIdParam = searchParams.get('listingId')
        
        if (listingIdParam) {
          setListingId(listingIdParam)
        }
        
        if (userIdParam) {
          // Start a conversation with this specific user
          startConversationWithUser(userIdParam, listingIdParam || undefined, convos)
        } else {
          // No userId in URL, auto-select the first one
          if (convos && convos.length > 0) {
            selectConversation(convos[0])
          }
        }
      })
    }
  }, [isAuthenticated, authLoading, searchParams])
  
  // Reset the ref when searchParams change (new URL navigation)
  useEffect(() => {
    hasProcessedUrlParams.current = false
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    setLoading(true)
    const convos = await getConversations()
    setConversations(convos)
    setLoading(false)
    return convos
  }

  const startConversationWithUser = async (userId: string, listingIdParam?: string, freshConversations?: Conversation[]) => {
    // Check if conversation already exists in the provided list or current state
    const convoList = freshConversations || conversations
    const existing = convoList.find(c => c.userId === userId)
    if (existing) {
      selectConversation(existing)
    } else {
      // Fetch user data to create a proper conversation
      setLoadingNewConversation(true)
      try {
        const userData = await getUser(userId)
        
        if (!userData) {
          toast.error("User not found")
          router.push("/messages")
          return
        }

        let listingData = null
        if (listingIdParam) {
          try {
            listingData = await getListing(listingIdParam)
          } catch (error) {
            console.error("Error fetching listing:", error)
          }
        }

        // Create conversation with real user data
        const userName = userData.username || "User"
        const newConversation: Conversation = {
          userId,
          userName,
          userProfileImage: userData.profileImageUrl,
          lastMessage: "",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          listingId: listingIdParam,
          listingTitle: listingData?.title
        }
        
        setSelectedConversation(newConversation)
        // Add the new conversation to the list so it appears on the left
        setConversations([newConversation, ...(freshConversations || conversations)])
        setMessages([])
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user information")
        router.push("/messages")
      } finally {
        setLoadingNewConversation(false)
      }
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setLoadingMessages(true)
    const msgs = await getConversation(conversation.userId)
    setMessages(msgs)
    setLoadingMessages(false)

    // Update unread count
    if (conversation.unreadCount > 0) {
      setConversations(prevConversations => 
        prevConversations.map(c =>
          c.userId === conversation.userId ? { ...c, unreadCount: 0 } : c
        )
      )
      // Notify header to update message count
      window.dispatchEvent(new Event('messages-updated'))
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    const result = await sendMessage(
      selectedConversation.userId, 
      newMessage.trim(), 
      selectedConversation.listingId || listingId
    )

    if (result.success && result.message) {
      setMessages([...messages, result.message])
      setNewMessage("")

      // Update conversation list
      const updatedConversation: Conversation = {
        ...selectedConversation,
        lastMessage: newMessage.trim(),
        lastMessageTime: new Date().toISOString(),
        userName: result.message.receiverName // Update with actual name from response
      }
      
      // Remove old conversation and add updated one at top
      const filtered = conversations.filter(c => c.userId !== selectedConversation.userId)
      setConversations([updatedConversation, ...filtered])
      setSelectedConversation(updatedConversation)

      // Don't show toast notification for sent messages
    } else {
      toast.error(result.error || t('messageError'))
    }
    setSending(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <MessageSquare className="h-8 w-8" />
          {t('myMessages')}
        </h1>

        <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">{t('messages')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('noConversations')}</p>
                  <p className="text-sm mt-2">{t('startConversation')}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.userId}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 hover:bg-muted/50 transition-colors text-left ${
                        selectedConversation?.userId === conversation.userId ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {conversation.userProfileImage ? (
                            <img
                              src={conversation.userProfileImage}
                              alt={conversation.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6 text-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold truncate">{conversation.userName}</h3>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="flex-shrink-0">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          {conversation.listingTitle && (
                            <p className="text-xs text-muted-foreground mb-1 truncate">
                              Re: {conversation.listingTitle}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground truncate flex-1">
                              {conversation.lastMessage}
                            </p>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages View */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <CardHeader className="border-b gap-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedConversation.userProfileImage ? (
                        <img
                          src={selectedConversation.userProfileImage}
                          alt={selectedConversation.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{selectedConversation.userName}</h3>
                      {selectedConversation.listingTitle && (
                        <Link
                          href={`/listings/${selectedConversation.listingId}`}
                          className="text-sm text-primary hover:underline truncate block"
                        >
                          Re: {selectedConversation.listingTitle}
                        </Link>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages || loadingNewConversation ? (
                    <div className="text-center text-muted-foreground">Loading...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>{t('noMessages')}</p>
                      <p className="text-sm mt-2">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        // Check if this is the last message sent by the current user
                        // It's the last sent message if it's from the user AND either:
                        // 1. It's the very last message in the list, OR
                        // 2. The next message is from the other person
                        const isLastSentMessage = message.senderId === user?.id && (
                          index === messages.length - 1 || 
                          (index < messages.length - 1 && messages[index + 1].senderId !== user?.id)
                        )
                        
                        return (
                          <div
                            key={message.id}
                            className={`group flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'} items-center gap-2`}
                          >
                            {/* Timestamp and Delivered on left for sent messages */}
                            {message.senderId === user?.id && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.createdAt)}
                                </span>
                                {isLastSentMessage && (
                                  <span className="text-xs text-muted-foreground">· Delivered</span>
                                )}
                              </div>
                            )}
                            
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="break-words">{message.content}</p>
                            </div>
                            
                            {/* Timestamp on right for received messages */}
                            {message.senderId !== user?.id && (
                              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {formatTime(message.createdAt)}
                              </span>
                            )}
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </CardContent>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('typeMessage')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      disabled={sending}
                    />
                    <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
