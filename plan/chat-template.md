# Chat template implementation plan

- Goal: implement the supplied Figma chat container as an admin template at `/page-template/chat`.
- Use the existing admin shell, `VCard`, `VTextField`, `VAvatar`, `VChip`, and `VBtn`. No reusable chat component exists in the inspected page templates; the composition remains local to the page.
- Map Figma Inter to project Poppins, blue to semantic `primary`, white to `surface`, and the conversation background to `chat-bg`. Retain the 4px spacing scale and compact chat geometry.
- Store demo conversations and messages in page state. Search, read filters, selection, reply, templates, and sending update local state only. On mobile, switch between the list and selected conversation. No table is involved.
- Validate lint and production build, then review desktop/mobile and light/dark in a browser if available. No backend or actual message delivery is in scope.
- Add the Figma floating chatbox to the same page, sharing conversation data while maintaining separate selection and composer state. Include collapsed, empty, selected, reply, and template states; switch between list and conversation on narrow screens. Set `sidebarRoute` for the existing active-navigation contract.
