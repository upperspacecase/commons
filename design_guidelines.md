# Design Guidelines for Commons

## Design Approach

**Reference-Based Design** inspired by Honk's playful, colorful aesthetic. This creates a joyful, friendly experience for sharing items among friends with pastel colors, bold typography, and delightful illustrations.

**Key Principles:**
- Playful and colorful through pastel tones
- Community-first, friendship-centered interactions
- Bold, friendly typography
- Joyful, effortless sharing experience

---

## Color Palette

### Light Mode (Pastel Colors)
- **Background**: 0 0% 100% (pure white)
- **Surface**: Individual pastel colors for feature cards
- **Text Primary**: 0 0% 15% (dark gray for readability)
- **Text Secondary**: 0 0% 45%

### Pastel Feature Colors
- **Light Blue**: 210 100% 95% (onboarding, messages)
- **Light Green**: 145 60% 92% (success, availability)
- **Light Pink**: 340 100% 95% (friendly, social)
- **Light Yellow**: 45 100% 92% (highlights, warnings)
- **Light Purple**: 270 60% 94% (premium, special)

### Semantic Colors
- **Primary**: 210 100% 60% (bright blue for main actions)
- **Success**: 145 70% 50% (green for available items)
- **Warning**: 45 100% 60% (yellow for attention)
- **Danger**: 0 80% 60% (red for destructive actions)

### Dark Mode
- **Background**: 220 18% 12%
- **Surface**: 220 18% 16%
- **Text Primary**: 0 0% 96%
- **Text Secondary**: 0 0% 70%
- Pastel colors adjusted for dark mode with reduced brightness

---

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - clean, modern, readable
- Display: 'DM Sans' (Google Fonts) - bold, friendly headings

**Scale (Bold and Large):**
- Hero: text-6xl md:text-7xl font-bold (extra large)
- Page Headings: text-4xl md:text-5xl font-bold
- Section Titles: text-3xl font-bold
- Card Titles: text-xl font-bold
- Body: text-base leading-relaxed
- Captions: text-sm font-medium

**Character:**
Bold, friendly, and easy to read with generous spacing

---

## Layout System

**Spacing Primitives:** Generous spacing with Tailwind units of 4, 6, 8, 12, 16, 24

**Container Strategy:**
- Main content: max-w-7xl
- Feature cards: max-w-6xl
- Forms/Modals: max-w-2xl
- Padding: px-6 md:px-12 lg:px-16 (extra generous)

**Grid Systems:**
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Item grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

---

## Component Library

### Feature Cards (Honk Style)
Large, colorful cards with playful illustrations and bold text

**Structure:**
- Background: Solid pastel color (light blue, green, pink, yellow, purple)
- Padding: p-12 md:p-16 (very generous)
- Border radius: rounded-3xl (very rounded)
- Typography: text-3xl md:text-4xl font-bold
- Icons/Illustrations: Large, simple, playful
- Shadows: Subtle or none (flat design)

**Example Colors:**
- Blue card: bg-[#E3F2FD] for messaging features
- Green card: bg-[#C8E6C9] for sharing features
- Pink card: bg-[#F8BBD0] for social features
- Yellow card: bg-[#FFF9C4] for highlights
- Purple card: bg-[#E1BEE7] for special features

### Navigation
**Desktop Header:** Clean top bar with logo left, centered search, profile right. Minimal design with plenty of white space.

**Mobile:** Bottom navigation with rounded icon buttons. Active state with bold icons.

### Item Cards
Clean, minimal card design with rounded corners

**Structure:**
- Image: aspect-square, rounded-2xl
- Content: p-6, bold item name
- Status badge: Rounded-full with pastel colors
- Hover: Subtle shadow increase

### Buttons
- Primary: Bold, rounded-xl, px-8 py-4, text-lg font-semibold
- Secondary: Outline style with rounded-xl
- Emphasis on bold text and generous padding

### Input Fields
- Clean, minimal design
- Rounded-xl borders
- Large padding (p-4)
- Focus state: Bold border in primary color

---

## Images

### Hero Section
Large, friendly illustrations or photography with pastel overlays. Warm, inviting, community-focused.

### Item Photos
User-uploaded with clean, white backgrounds encouraged. Placeholder uses pastel colored icons.

### Profile Avatars
Circular with colorful borders. Default to pastel gradient backgrounds with bold initials.

### Illustrations
Simple, playful icons and illustrations in pastel colors. Honk-style messaging bubbles, lock icons, gesture icons.

---

## Interactive Elements

**Animations:**
Playful but subtle:
- Button hover: Slight scale
- Card hover: Shadow increase
- Modal entry: Slide-up
- Transitions: Smooth and quick

**Touch Targets:**
- Minimum 48px on mobile
- Generous spacing between interactive elements

---

## Mobile Considerations

- Bottom nav with large touch targets
- Full-screen modals with rounded tops
- Swipe gestures supported
- Native-style transitions
- Generous padding for thumb reach

---

**Design Philosophy:** Every interaction should feel playful, friendly, and delightful. Bright pastel colors, bold typography, and simple illustrations create a joyful space where sharing with friends is fun and easy.
