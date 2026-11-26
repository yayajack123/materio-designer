<script setup lang="ts">
useHead({ title: 'Chat template' })
definePageMeta({ sidebarRoute: 'page-template-chat' })

type Message = { text: string; outgoing: boolean; time: string; reply?: string }
type Chat = { name: string; preview: string; date: string; unread: boolean; messages: Message[] }

const names = ['Felecia Rower', 'Jonas Meyer', 'Sophie Chen', 'Marcus Lee', 'Amara Costa', "Liam O’Reilly", 'Zara Khan', 'Derek Wong', 'Maya Patel', 'Ethan Brooks']
const previews = ['I will purchase it for sure. 👍', 'Looking forward to trying it out!', 'Count me in, sounds great!', 'I have some questions about the features.', 'Is there a discount for early buyers?', 'Can’t wait to see the final product!', 'This is exactly what I need!', 'Great initiative! How can I help?', 'I’m in! Let’s make this happen.', 'I hope to see more updates soon.']
const chats = ref<Chat[]>(names.map((name, index) => ({
  name,
  preview: previews[index],
  date: `Apr ${10 + index}, ${index ? '14:00' : '20:30'}`,
  unread: index > 0 && index < 4,
  messages: index === 0 ? [
    { text: 'Absolutely!', outgoing: true, time: '1:15 PM' },
    { text: 'Hey, I want to ask about my order progress?', outgoing: false, time: '1:15 PM' },
    { text: 'Great! Can I get a tracking number once it ships?', outgoing: false, time: '1:15 PM' },
    { text: 'Absolutely!', outgoing: true, time: '1:16 PM' },
    { text: 'This order is supermarket order?', outgoing: true, time: '1:16 PM' },
    { text: 'This admin template is built with MUI!', outgoing: true, time: '1:16 PM' },
  ] : [{ text: previews[index], outgoing: false, time: '1:15 PM' }],
})))
const selected = ref(0)
const search = ref('')
const filter = ref('All')
const draft = ref('')
const reply = ref('')
const showTemplates = ref(false)
const mobileConversation = ref(false)
const chatboxOpen = ref(false)
const chatboxKeyboard = ref(false)
function toggleChatbox(open: boolean, event: MouseEvent) {
  chatboxKeyboard.value = event.detail === 0
  chatboxOpen.value = open
}
const chatboxSelected = ref<number | null>(null)
const chatboxSearch = ref('')
const chatboxFilter = ref('All')
const chatboxDraft = ref('')
const chatboxReply = ref('')
const chatboxTemplates = ref(false)
const templates = [
  { title: 'Order', text: 'Your order is being processed in our warehouse. Please wait for an update.' },
  { title: 'New order', text: 'Thank you for your order. We will keep you updated.' },
]
const visibleChats = computed(() => chats.value.map((chat, index) => ({ ...chat, index })).filter(chat => chat.name.toLowerCase().includes(search.value.toLowerCase()) && (filter.value === 'All' || (filter.value === 'Unread' ? chat.unread : !chat.unread))))
const current = computed(() => chats.value[selected.value])
const chatboxCurrent = computed(() => chatboxSelected.value === null ? null : chats.value[chatboxSelected.value])
const chatboxChats = computed(() => chats.value.map((chat, index) => ({ ...chat, index })).filter(chat => chat.name.toLowerCase().includes(chatboxSearch.value.toLowerCase()) && (chatboxFilter.value === 'All' || (chatboxFilter.value === 'Unread' ? chat.unread : !chat.unread))))
const unreadCount = computed(() => chats.value.filter(chat => chat.unread).length)

function selectChatbox(index: number) {
  chatboxSelected.value = index
  chats.value[index].unread = false
  chatboxReply.value = ''
  chatboxTemplates.value = false
}

function sendChatboxMessage() {
  const text = chatboxDraft.value.trim()
  if (!text || !chatboxCurrent.value) return
  const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())
  chatboxCurrent.value.messages.push({ text, outgoing: true, time, reply: chatboxReply.value || undefined })
  chatboxCurrent.value.preview = text
  chatboxDraft.value = ''
  chatboxReply.value = ''
  chatboxTemplates.value = false
}

function selectChat(index: number) {
  selected.value = index
  chats.value[index].unread = false
  reply.value = ''
  showTemplates.value = false
  mobileConversation.value = true
}

function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())
  current.value.messages.push({ text, outgoing: true, time, reply: reply.value || undefined })
  current.value.preview = text
  draft.value = ''
  reply.value = ''
  showTemplates.value = false
}
</script>

<template>
  <div>
    <UiSectionHeader title="Chat" title-class="text-h4" description="Review and reply to customer conversations." class="mb-6"><template #actions><TemplatePrompt template="chat" /></template></UiSectionHeader>
    <VCard variant="outlined" class="chat-shell" :class="{ 'show-conversation': mobileConversation }">
      <aside class="chat-list" aria-label="Conversations">
        <div class="chat-list-header"><VTextField v-model="search" aria-label="Search conversations" placeholder="Search..." prepend-inner-icon="ri-search-line" density="compact" hide-details rounded="pill" /></div>
        <div class="chat-list-body">
          <h2 class="text-h6 text-primary px-3 mb-2">Chats</h2>
          <div class="d-flex ga-2 px-3 mb-3" aria-label="Filter conversations">
            <VChip v-for="item in ['All', 'Unread', 'Read']" :key="item" :color="filter === item ? 'primary' : 'secondary'" :variant="filter === item ? 'flat' : 'tonal'" size="small" role="button" :aria-pressed="filter === item" @click="filter = item">{{ item }}</VChip>
          </div>
          <div v-if="!visibleChats.length" class="text-body-2 text-medium-emphasis pa-3">No conversations found.</div>
          <button v-for="chat in visibleChats" :key="chat.index" class="chat-item" :class="{ 'chat-item-active': selected === chat.index }" :aria-current="selected === chat.index ? 'true' : undefined" @click="selectChat(chat.index)">
            <VAvatar size="40" :color="selected === chat.index ? 'surface' : 'primary'" :variant="selected === chat.index ? 'flat' : 'tonal'">{{ chat.name.split(' ').map(part => part[0]).join('') }}</VAvatar>
            <span class="chat-item-content"><span class="chat-item-row"><strong>{{ chat.name }}</strong><small>{{ chat.date }}</small></span><span class="chat-item-row"><span class="chat-preview">{{ chat.preview }}</span><span v-if="chat.unread" class="unread-dot" aria-label="Unread" /></span></span>
          </button>
        </div>
      </aside>
      <section class="conversation" aria-label="Conversation">
        <header class="conversation-header">
          <VBtn class="mobile-back" icon="ri-arrow-left-line" variant="text" size="small" aria-label="Back to conversations" @click="mobileConversation = false" />
          <VAvatar size="40" color="primary" variant="tonal">{{ current.name.split(' ').map(part => part[0]).join('') }}</VAvatar>
          <div><div class="text-body-1 font-weight-medium">{{ current.name }}</div><div class="text-caption text-medium-emphasis">General user</div></div>
        </header>
        <div class="messages" aria-label="Messages" aria-live="polite">
          <div v-for="(message, index) in current.messages" :key="index" class="message-group" :class="{ outgoing: message.outgoing }">
            <div class="message-bubble"><div v-if="message.reply" class="message-reply">{{ message.reply }}</div>{{ message.text }}</div>
            <div class="message-meta"><span>{{ message.time }}</span><VBtn v-if="!message.outgoing" icon="ri-reply-line" variant="text" size="x-small" aria-label="Reply to message" @click="reply = message.text" /></div>
          </div>
        </div>
        <div class="composer-wrap">
          <div v-if="reply || showTemplates" class="composer-panel">
            <div v-if="reply" class="reply-box"><div><div class="font-weight-medium"><VIcon icon="ri-reply-line" size="16" /> {{ current.name }}</div><div class="text-caption text-medium-emphasis">{{ reply }}</div></div><VBtn icon="ri-close-line" variant="text" size="small" aria-label="Cancel reply" @click="reply = ''" /></div>
            <div v-if="showTemplates" class="template-list"><button v-for="template in templates" :key="template.title" class="template-item" @click="draft = template.text; showTemplates = false"><span class="text-caption text-medium-emphasis">Template chat</span><span><strong>{{ template.title }}</strong> · {{ template.text }}</span></button></div>
          </div>
          <form class="composer" @submit.prevent="sendMessage"><VTextField v-model="draft" aria-label="Message" placeholder="Type a message..." variant="plain" hide-details @keydown.enter.prevent="sendMessage" /><VBtn icon="ri-chat-1-line" variant="text" size="small" aria-label="Choose message template" :aria-expanded="showTemplates" @click="showTemplates = !showTemplates" /><VBtn type="submit" color="primary" :disabled="!draft.trim()" append-icon="ri-send-plane-line">Send</VBtn></form>
          <div class="text-caption text-medium-emphasis mt-2">Demo only. Messages stay in this page session.</div>
        </div>
      </section>
    </VCard>
    <div class="floating-chat" :class="{ 'chatbox-keyboard': chatboxKeyboard }">
      <VBtn v-if="!chatboxOpen" color="surface" class="chat-launcher" @click="toggleChatbox(true, $event)">
        <VIcon icon="ri-question-answer-line" color="primary" class="me-2" /> <span class="text-primary">Customer Chat</span><VChip v-if="unreadCount" color="primary" size="small" class="ms-2">{{ unreadCount }}</VChip>
      </VBtn>
      <Transition name="chatbox-motion">
      <VCard v-if="chatboxOpen" class="chatbox" variant="outlined" aria-label="Customer Chat">
        <header class="chatbox-header"><h2 class="text-h6 text-primary">Customer Chat</h2><VSpacer /><VBtn icon="ri-external-link-line" variant="text" size="small" aria-label="Open full chat" @click="toggleChatbox(false, $event)" /><VBtn icon="ri-arrow-down-s-line" variant="text" size="small" aria-label="Minimize customer chat" @click="toggleChatbox(false, $event)" /></header>
        <div class="chatbox-body" :class="{ 'chatbox-has-selection': chatboxCurrent }">
          <aside class="chatbox-list" aria-label="Customer conversations">
            <div class="chatbox-filters"><VTextField v-model="chatboxSearch" aria-label="Search customer conversations" placeholder="Search..." prepend-inner-icon="ri-search-line" density="compact" hide-details rounded="pill" /><VSelect v-model="chatboxFilter" :items="['All', 'Unread', 'Read']" aria-label="Filter customer conversations" density="compact" hide-details class="chatbox-filter" /></div>
            <div class="chatbox-items"><div v-if="!chatboxChats.length" class="text-body-2 text-medium-emphasis pa-2">No conversations found.</div><button v-for="chat in chatboxChats" :key="chat.index" class="chat-item" :class="{ 'chat-item-active': chatboxSelected === chat.index }" :aria-current="chatboxSelected === chat.index ? 'true' : undefined" @click="selectChatbox(chat.index)"><VAvatar size="40" :color="chatboxSelected === chat.index ? 'surface' : 'primary'" :variant="chatboxSelected === chat.index ? 'flat' : 'tonal'">{{ chat.name.split(' ').map(part => part[0]).join('') }}</VAvatar><span class="chat-item-content"><span class="chat-item-row"><strong>{{ chat.name }}</strong></span><span class="chat-item-row"><span class="chat-preview">{{ chat.preview }}</span><span v-if="chat.unread" class="unread-dot" aria-label="Unread" /></span></span></button></div>
          </aside>
          <section v-if="chatboxCurrent" class="chatbox-conversation" aria-label="Customer conversation">
            <header class="chatbox-conversation-header"><VBtn class="chatbox-back" icon="ri-arrow-left-line" variant="text" size="small" aria-label="Back to customer conversations" @click="chatboxSelected = null" /><div><div class="text-body-1 font-weight-medium">{{ chatboxCurrent.name }}</div><div class="text-caption text-medium-emphasis">General user</div></div></header>
            <div class="messages" aria-live="polite"><div v-for="(message, index) in chatboxCurrent.messages" :key="index" class="message-group" :class="{ outgoing: message.outgoing }"><div class="message-bubble"><div v-if="message.reply" class="message-reply">{{ message.reply }}</div>{{ message.text }}</div><div class="message-meta"><span>{{ message.time }}</span><VBtn v-if="!message.outgoing" icon="ri-reply-line" variant="text" size="x-small" aria-label="Reply to message" @click="chatboxReply = message.text" /></div></div></div>
            <div class="chatbox-compose"><div v-if="chatboxReply || chatboxTemplates" class="composer-panel"><div v-if="chatboxReply" class="reply-box"><div><div class="font-weight-medium"><VIcon icon="ri-reply-line" size="16" /> {{ chatboxCurrent.name }}</div><div class="text-caption text-medium-emphasis">{{ chatboxReply }}</div></div><VBtn icon="ri-close-line" variant="text" size="small" aria-label="Cancel reply" @click="chatboxReply = ''" /></div><div v-if="chatboxTemplates" class="template-list"><button v-for="template in templates" :key="template.title" class="template-item" @click="chatboxDraft = template.text; chatboxTemplates = false"><span class="text-caption text-medium-emphasis">Template chat</span><span><strong>{{ template.title }}</strong> · {{ template.text }}</span></button></div></div><form class="composer" @submit.prevent="sendChatboxMessage"><VTextField v-model="chatboxDraft" aria-label="Customer message" placeholder="Your message" variant="plain" hide-details @keydown.enter.prevent="sendChatboxMessage" /><VBtn icon="ri-chat-1-line" variant="text" size="small" aria-label="Choose message template" :aria-expanded="chatboxTemplates" @click="chatboxTemplates = !chatboxTemplates" /><VBtn type="submit" color="primary" icon="ri-send-plane-line" size="small" aria-label="Send message" :disabled="!chatboxDraft.trim()" /></form></div>
          </section>
          <div v-else class="chatbox-empty"><VAvatar color="primary" variant="tonal" size="96"><VIcon icon="ri-question-answer-line" size="40" /></VAvatar><p class="text-body-1 text-medium-emphasis mt-4">Select one user to display detail chat room</p></div>
        </div>
      </VCard>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.chat-shell { display: flex; height: min(856px, calc(100vh - 190px)); min-height: 580px; overflow: hidden; }
.chat-list { width: 370px; flex: 0 0 370px; display: flex; flex-direction: column; background: rgb(var(--v-theme-surface)); border-inline-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chat-list-header, .conversation-header { min-height: 76px; padding: 16px 20px; border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chat-list-body { padding: 16px 12px; overflow-y: auto; }
.chat-item { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 64px; padding: 8px; border-radius: 6px; text-align: start; color: inherit; }
.chat-item:hover { background: rgba(var(--v-theme-on-surface), .04); }
.chat-item-active, .chat-item-active:hover { color: rgb(var(--v-theme-on-primary)); background: rgb(var(--v-theme-primary)); }
.chat-item-content { flex: 1; min-width: 0; }
.chat-item-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.chat-item-row strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.chat-item-row small, .chat-preview { font-size: 12px; }
.chat-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: .8; }
.unread-dot { width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--v-theme-primary)); flex: none; }
.conversation { min-width: 0; flex: 1; display: flex; flex-direction: column; background: rgb(var(--v-theme-chat-bg)); }
.conversation-header { display: flex; align-items: center; gap: 12px; }
.messages { flex: 1; min-height: 0; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.message-group { align-self: flex-start; max-width: 75%; }
.message-group.outgoing { align-self: flex-end; }
.message-bubble { padding: 8px 16px; border-radius: 6px; background: rgb(var(--v-theme-surface)); box-shadow: 0 2px 4px rgba(0, 0, 0, .1); overflow-wrap: anywhere; }
.outgoing .message-bubble { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); }
.message-reply { border-inline-start: 2px solid currentColor; padding-inline-start: 8px; margin-bottom: 4px; opacity: .8; font-size: 12px; }
.message-meta { display: flex; align-items: center; gap: 4px; color: rgba(var(--v-theme-on-surface), .6); font-size: 12px; }
.outgoing .message-meta { justify-content: end; }
.composer-wrap { padding: 0 20px 16px; }
.composer-panel, .composer { background: rgb(var(--v-theme-surface)); box-shadow: 0 2px 6px rgba(0, 0, 0, .12); }
.composer-panel { border-radius: 8px 8px 0 0; overflow: hidden; }
.reply-box { display: flex; justify-content: space-between; gap: 8px; padding: 12px 16px; border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.template-list { max-height: 146px; overflow-y: auto; }
.template-item { display: flex; flex-direction: column; gap: 4px; width: 100%; padding: 8px 16px; text-align: start; border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); font-size: 13px; }
.template-item:hover { background: rgba(var(--v-theme-on-surface), .04); }
.composer { display: flex; align-items: center; gap: 8px; padding: 8px; padding-inline-start: 16px; border-radius: 6px; }
.mobile-back { display: none; }
.floating-chat { position: fixed; z-index: 900; right: 24px; bottom: 0; }
.chat-launcher { height: 52px !important; border-radius: 4px 4px 0 0 !important; box-shadow: 0 -4px 6px rgba(95, 95, 95, .2) !important; }
.chatbox { width: min(700px, calc(100vw - 32px)); height: min(624px, calc(100dvh - 24px)); display: flex; flex-direction: column; border-radius: 12px 12px 0 0; box-shadow: 0 -4px 16px rgba(0, 0, 0, .12); }
.chatbox-motion-enter-active, .chatbox-motion-leave-active { transition: transform 200ms cubic-bezier(.23, 1, .32, 1), opacity 200ms cubic-bezier(.23, 1, .32, 1); transform-origin: bottom right; }
.chatbox-motion-enter-from, .chatbox-motion-leave-to { opacity: 0; transform: translateY(12px) scale(.98); }
.chatbox-motion-leave-active { position: absolute; right: 0; bottom: 0; pointer-events: none; }
.chatbox-keyboard .chatbox-motion-enter-active, .chatbox-keyboard .chatbox-motion-leave-active { transition: none; }
@media (prefers-reduced-motion: reduce) { .chatbox-motion-enter-active, .chatbox-motion-leave-active { transition: opacity 200ms cubic-bezier(.23, 1, .32, 1); } .chatbox-motion-enter-from, .chatbox-motion-leave-to { transform: none; } }
.chatbox-header { display: flex; align-items: center; gap: 4px; padding: 4px 8px 4px 16px; background: rgb(var(--v-theme-surface)); border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chatbox-body { display: flex; flex: 1; min-height: 0; background: rgb(var(--v-theme-chat-bg)); }
.chatbox-list { width: 250px; flex: 0 0 250px; display: flex; flex-direction: column; min-height: 0; background: rgb(var(--v-theme-surface)); border-inline-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chatbox-filters { display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chatbox-filters :deep(.v-text-field) { min-width: 0; }
.chatbox-filter { max-width: 88px; }
.chatbox-items { overflow-y: auto; padding: 12px; }
.chatbox-empty { display: flex; flex: 1; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 16px; }
.chatbox-conversation { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.chatbox-conversation-header { display: flex; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.chatbox-compose { padding: 12px; }
.chatbox-back { display: none; }
@media (max-width: 600px) { .floating-chat { right: 8px; } .chatbox-list { width: 100%; flex-basis: 100%; } .chatbox-empty { display: none; } .chatbox-has-selection .chatbox-list { display: none; } .chatbox-back { display: inline-flex; } }
@media (max-width: 767px) { .chat-shell { height: calc(100vh - 220px); min-height: 500px; } .chat-list { width: 100%; flex-basis: 100%; border: 0; } .conversation { display: none; } .show-conversation .chat-list { display: none; } .show-conversation .conversation { display: flex; } .mobile-back { display: inline-flex; } .message-group { max-width: 90%; } .composer-wrap { padding-inline: 12px; } }
</style>
