# Project: PlayTogether — Private Multiplayer Gaming Platform

## 1. Project Overview

Design and develop a modern, visually appealing web application called **PlayTogether**.

PlayTogether is a private online hangout and gaming platform for a small group of 6–10 friends.

PlayTogether is temporary and not official name.

The concept combines:

- An online multiplayer gaming platform.
- A private social space for friends.
- A shared room where people can chat, play games, exchange photos, and interact.
- AI-powered entertainment and game assistance.

The platform should feel like a combination of a cozy Discord server, a modern gaming arcade, and a private virtual hangout.

The primary goal is to make it extremely easy for friends to enter a shared room and start having fun together.

## 2. Design Direction — Dual Visual Themes

Create a polished multiplayer gaming platform with two distinct, selectable visual art directions:

1. **Retro Pixel Arcade** — inspired by classic 8-bit and 16-bit games from the 1980s and 1990s.
2. **Smooth Modern** — inspired by contemporary gaming platforms and modern social applications.

Both themes must share the same core brand identity, with **Purple / Lavender as the preferred primary color palette**.
PlayTogether should feel comfortable to stay in, not just exciting to look at.

Prioritize visual comfort, balanced colors, gentle contrast, and readable typography. Avoid excessive neon, overly saturated colors, harsh shadows, and constant animations. The interface should feel like a cozy digital room where friends can spend several hours together.

The platform should support switching between these themes globally, while also allowing individual games to use their own appropriate visual direction.

### 2.1 Shared Brand Identity

Regardless of the selected theme, maintain a recognizable PlayTogether identity.

**Preferred color palette:**

| Role | Color |
| --- | --- |
| Primary | Lavender `#A78BFA` |
| Secondary | Purple `#8B5CF6` |
| Accent | Soft Pink `#F0ABFC` |
| Accent 2 | Soft Blue `#93C5FD` |
| Highlight | Light Lavender `#DDD6FE` |
| Success | `#86EFAC` |
| Main text | Theme-dependent |
| Background | Theme-dependent |

Purple and lavender should remain the dominant brand colors.

Other colors can be introduced within individual games when they improve gameplay clarity or match the game's identity.

---

### 2.2 Option A — Retro Pixel Arcade

**Concept:** Classic arcade gaming from the 1980s and 1990s.

Visual inspiration:

- Pac-Man.
- Space Invaders.
- Galaga.
- Classic arcade machines.
- 8-bit and 16-bit RPG games.
- Pixel-art adventures.

**Visual characteristics:**

- Pixel-art illustrations and characters.
- Pixel-style icons and decorative elements.
- Stepped borders and rectangular UI elements.
- Pixel-inspired typography.
- Retro arcade scoreboards and HUDs.
- Pixel-art avatars.
- Subtle CRT effects and scanlines.
- Arcade-style buttons and menus.
- Pixel hearts, coins, stars, and achievements.

**Color palette:**

- Deep midnight purple: `#171329`.
- Dark navy: `#101426`.
- Lavender: `#A78BFA`.
- Neon purple: `#8B5CF6`.
- Cyan: `#4DEEEA`.
- Pink: `#FF6AC1`.
- Retro yellow: `#FFE66D`.

**Typography:**

- Press Start 2P for major headings and arcade labels.
- VT323 or Share Tech Mono for game-related text.
- Readable sans-serif fonts for longer descriptions.

**UI design:**

- Pixel-style rectangular buttons.
- Pixel borders.
- Dark arcade panels.
- Retro game thumbnails.
- High-score tables.
- START / READY / GAME OVER labels.
- Pixel animations and effects.

**Atmosphere:** A cozy virtual arcade where friends gather to play classic games, compete for scores, and unlock achievements.

---

### 2.3 Option B — Smooth Modern

**Concept:** A contemporary multiplayer gaming and social platform with a friendly, polished appearance.

Visual inspiration:

- Modern indie game interfaces.
- Contemporary gaming launchers.
- Modern social platforms.
- Minimalist game dashboards.
- Premium SaaS applications.

**Visual characteristics:**

- Smooth rounded cards.
- Soft gradients.
- Elegant shadows.
- Subtle glass effects.
- Fluid animations.
- Clean typography.
- Beautiful illustrations.
- Smooth icons.
- Generous spacing.
- Responsive layouts.

**Color palette:**

- Soft lavender: `#C4B5FD`.
- Primary purple: `#8B5CF6`.
- Deep violet: `#6D28D9`.
- Soft pink: `#F5D0FE`.
- Light blue: `#BFDBFE`.
- Background: Soft off-white or dark navy-purple.
- Text: High-contrast theme-dependent colors.

**Typography:**

- Inter or Plus Jakarta Sans for general UI.
- Modern bold headings.
- Clear hierarchy and readable descriptions.

**UI design:**

- Rounded game cards.
- Smooth buttons.
- Soft hover animations.
- Modern player avatars.
- Elegant game thumbnails.
- Animated transitions.
- Clean room layouts.
- Modern notification and chat components.

**Atmosphere:** A comfortable digital hangout space where friends can socialize and play games in a beautiful, modern environment.

---

### 2.4 Theme Selection and Customization

Implement a theme system that supports the following options:

**Global theme selection:**

- Retro Pixel Arcade.
- Smooth Modern.

Allow users to change the overall website appearance through Settings.

**Per-game art direction:**

Each individual game should also be able to define its own visual theme independently of the global website theme.

For example:

| Game | Recommended art direction |
| --- | --- |
| Pac-Man-inspired game | Retro Pixel Arcade |
| Space shooter | Retro Pixel Arcade |
| Chess | Smooth Modern |
| Jigsaw Puzzle | Smooth Modern |
| Drawing & Guessing | Smooth Modern or Pixel Arcade |
| Trivia Quiz | Either |
| Memory Matching | Either |
| Werewolf / Mafia | Smooth Modern |
| Connect Four | Either |

These are defaults, not restrictions. Allow the user to override them when appropriate.

**Important:** A game's visual theme should not change its rules, mechanics, synchronization, or gameplay logic. Keep presentation and game logic separate.

---

### 2.5 Implementation Requirements

Build a reusable design system supporting both visual themes.

Suggested structure:

```text
src/
├── themes/
│   ├── index.ts
│   ├── retro/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── components.ts
│   └── modern/
│       ├── colors.ts
│       ├── typography.ts
│       └── components.ts
│
├── components/
│   ├── common/
│   ├── navigation/
│   ├── room/
│   └── games/
│
└── games/
    ├── pacman/
    ├── chess/
    ├── jigsaw/
    └── trivia/
```

Use shared components wherever possible, with theme-specific styling.

Avoid duplicating the entire application just to support two themes.

### 2.6 Final Design Objective

Create a platform that combines the nostalgia and personality of classic arcade games with the polish and usability of modern web applications.

The two visual directions should both feel like part of the same PlayTogether brand.

**Purple and lavender remain the recognizable brand identity, while the visual presentation can adapt to the website's overall theme and the personality of each individual game.**

## 3. Main Application Structure

Create the following main pages:

### A. Landing / Welcome Page

A welcoming homepage introducing PlayTogether.

Include:

- PlayTogether logo.
- A short slogan: "Your little corner of the internet to play together."
- Enter your display name.
- Join an existing room using a room code.
- Create a new room.
- A preview of available games.
- A visually appealing illustration or decorative gaming elements.

The login experience should be extremely simple.

No password or email registration should be required.

### B. Main Dashboard / Lobby

After entering a display name, users arrive at the main lobby.

Include:

**Header**

- PlayTogether logo.
- User avatar and display name.
- Online friends indicator.
- Notification icon.
- Theme toggle.
- Settings.

**Main content**

- Welcome message.
- Create Room button.
- Join Room button.
- Current active rooms.
- Recently played games.
- Available game library.

**Game categories**

- Puzzle Games.
- Board Games.
- Card Games.
- Drawing & Guessing.
- Trivia & Quiz.
- Party Games.
- Social Deduction.

Each game should have an attractive thumbnail, title, short description, player count, and Play button.

### C. Private Room Page

This is the most important part of the application.

Each room should function as a shared virtual hangout for 6–10 friends.

Layout:

**Room header**

- Room name.
- Room code with copy button.
- Invite friends button.
- Online player count.
- Room settings.
- Leave room button.

**Main area**

- Game selection area.
- Current game interface.
- Shared activity feed.
- Friends' avatars.
- Player status indicators.

**Social sidebar**

- Online members list.
- Text chat.
- Emoji reactions.
- Shared images and photos.
- Recent activities.

The room should feel alive even when nobody is currently playing a game.

### D. Game Library Page

Create a visually attractive game discovery page.

Organize games into categories.

Initial games to showcase:

1. Tic-Tac-Toe.
2. Connect Four.
3. Chess.
4. Checkers.
5. Jigsaw Puzzle.
6. Drawing & Guessing.
7. Trivia Quiz.
8. Card Games.
9. Werewolf / Mafia.
10. Memory Matching.

Each game should have:

- Game thumbnail.
- Name.
- Description.
- Supported player count.
- Estimated playing time.
- Play button.
- Multiplayer indicator.

Allow users to launch games inside their current private room.

### E. Shared Gallery

A place where room members can:

- Upload images and photos.
- View shared images.
- Browse images in a gallery.
- React to images.
- Add comments.
- Delete their own uploads.

Use a responsive masonry-style gallery.

### F. AI Corner

Create a dedicated section for AI-powered entertainment.

Potential features:

- AI Trivia Generator.
- AI Game Master.
- AI-generated riddles.
- AI-generated puzzles.
- AI opponent.
- AI-powered hints.
- Random challenge generator.

Make the AI section visually distinct but consistent with the rest of the application.

## 4. Important User Experience Requirements

The application should support:

- Passwordless login using a display name.
- Anonymous user identity behind the scenes.
- Creating private rooms.
- Joining rooms through room codes.
- Supporting 6–10 players per room.
- Real-time player presence.
- Real-time chat.
- Real-time multiplayer game synchronization.
- Image and photo sharing.
- Room invitations.
- Reconnecting after accidental disconnection.
- Mobile and desktop responsive layouts.

A user should be able to go from opening the website to playing a game with friends in less than one minute.

## 5. Technical Stack

Use the following architecture:

### Frontend

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui.
- Lucide icons.
- Framer Motion for animations.

### Backend

- Supabase.
- PostgreSQL database.
- Supabase Anonymous Authentication.
- Supabase Realtime.
- Supabase Storage.
- Supabase Edge Functions.

### AI

- Google Gemini API using an eligible free-tier model.
- All API calls must go through a secure backend function.
- Never expose API keys in frontend code.

### Hosting

- Vercel for frontend hosting.
- Supabase for backend infrastructure.

Prioritize free-tier compatibility.

## 6. Reusable Components

Build reusable components rather than duplicating UI.

Examples:

- Navbar.
- UserAvatar.
- OnlineIndicator.
- GameCard.
- GameCategory.
- RoomCard.
- RoomHeader.
- MemberList.
- ChatPanel.
- MessageBubble.
- ImageGallery.
- ImageUploader.
- InviteDialog.
- CreateRoomDialog.
- JoinRoomDialog.
- GameContainer.
- NotificationToast.

Maintain consistent spacing, colors, typography, and interaction patterns.

## 7. Interaction and Animation

Add polished interactions:

- Smooth page transitions.
- Hover effects on game cards.
- Animated online indicators.
- Button feedback.
- Toast notifications.
- Loading skeletons.
- Modal transitions.
- Drag-and-drop image uploads.
- Animated reactions.
- Responsive navigation.

Avoid excessive animations that affect performance.

## 8. Responsive Design

The application must work well on:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile phones.

On mobile:

- Use a compact navigation system.
- Make the chat panel accessible without taking over the entire screen.
- Ensure game boards and controls remain usable.
- Adapt the member list and gallery layout.

## 9. Security and Architecture

Although the platform is intended for friends, implement reasonable security.

- Use Supabase Row Level Security.
- Validate room membership.
- Restrict private room content to members.
- Validate game actions on the backend where necessary.
- Protect image uploads.
- Keep API secrets on the backend.
- Handle disconnected users and stale room sessions.

Do not implement name-only authentication as the sole security mechanism. Use anonymous authentication to maintain a unique internal identity for each browser session.

## 10. Development Priorities

Build the application incrementally.

### Phase 1 — UI Foundation

- Landing page.
- Anonymous login.
- Dashboard.
- Create/join room dialogs.
- Responsive navigation.

### Phase 2 — Social Room

- Room membership.
- Online presence.
- Chat.
- Room invitations.
- Room settings.

### Phase 3 — Multiplayer Games

- Tic-Tac-Toe.
- Connect Four.
- Drawing & Guessing.
- Jigsaw Puzzle.

### Phase 4 — Social Features

- Shared image gallery.
- Reactions.
- Comments.
- Activity feed.

### Phase 5 — AI Integration

- Gemini API integration.
- Trivia generation.
- AI game assistant.
- AI opponents.

## 11. Important Instructions for the AI Developer

- First, create a complete and coherent design system.
- Prioritize visual quality and user experience.
- Do not make the website look like a generic admin dashboard.
- Use realistic sample data for the initial UI.
- Every button should have a meaningful interaction.
- Do not create nonfunctional placeholder controls.
- Separate frontend components, business logic, and backend services.
- Use clean, maintainable TypeScript.
- Keep the application modular so new games can be added easily.
- Avoid paid dependencies and services wherever possible.
- Do not hardcode secrets.
- Keep the application deployable using free-tier services.

**Final objective:** Deliver a beautiful, cozy, modern multiplayer gaming platform where 6–10 friends can gather in a private virtual room, play games together, share memories, chat, and enjoy AI-powered activities.
