# Digital Card Generator - Project Documentation

## 📊 Project Status

**Overall Progress**: 22% Complete  
**Current Phase**: Phase 2 Completed, Phase 3 Next  
**Last Updated**: November 3, 2025

### ✅ Completed Phases
- **Phase 1**: Setup & Foundation ✅
- **Phase 2**: Card Type Selection ✅

### 🔄 Current & Upcoming Phases
- **Phase 3**: Form Development (Next)
- **Phase 4**: Card UI Designs
- **Phase 5**: Data Storage & API
- **Phase 6**: QR Code Generation
- **Phase 7**: Card View Page
- **Phase 8**: Testing & Polish
- **Phase 9**: Deployment

For detailed progress tracking, see [PROGRESS.md](./PROGRESS.md)

---

## 📋 Project Overview

A Next.js application that allows users to create digital business and bank cards with unique shareable links and QR codes. When scanned, the QR code automatically populates contact details or card information.

---

## 🎯 Project Features

### Core Features
1. **Card Type Selection**
   - Personal Business Card
   - Bank Card (for sharing payment details)
   
2. **Dynamic Form System**
   - Different forms based on card type
   - Real-time preview of card design
   
3. **Card Generation**
   - Unique shareable URL for each card
   - QR code generation
   - Multiple UI themes/styles per card type

4. **Card Viewing**
   - Scan QR or visit link to view card
   - Auto-populate contact details option
   - Responsive card display

---

## 🏗️ Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **QR Code**: qrcode.react or next-qrcode
- **Database**: JSON storage (localStorage for MVP) / Vercel KV or MongoDB
- **Deployment**: Vercel

---

## 📁 Project Structure

```
digital-card-app/
├── app/
│   ├── page.tsx                    # Landing page - card type selection
│   ├── create/
│   │   └── [type]/
│   │       └── page.tsx            # Dynamic form page
│   ├── card/
│   │   └── [id]/
│   │       └── page.tsx            # View card by ID
│   ├── api/
│   │   ├── cards/
│   │   │   └── route.ts            # Create/Get cards
│   │   └── card/
│   │       └── [id]/
│   │           └── route.ts        # Get specific card
│   └── layout.tsx
├── components/
│   ├── CardTypeSelector.tsx        # Card type selection UI
│   ├── BusinessCardForm.tsx        # Business card form
│   ├── BankCardForm.tsx           # Bank card form
│   ├── CardPreview.tsx            # Real-time preview
│   ├── QRCodeDisplay.tsx          # QR code component
│   ├── cards/
│   │   ├── BusinessCard/
│   │   │   ├── StyleOne.tsx
│   │   │   ├── StyleTwo.tsx
│   │   │   └── StyleThree.tsx
│   │   └── BankCard/
│   │       ├── StyleOne.tsx
│   │       ├── StyleTwo.tsx
│   │       └── StyleThree.tsx
│   └── ContactDownload.tsx        # vCard download
├── lib/
│   ├── cardStorage.ts             # Storage utilities
│   ├── qrGenerator.ts             # QR code utilities
│   └── vCardGenerator.ts          # vCard generation
├── types/
│   └── card.ts                    # TypeScript interfaces
└── public/
    └── assets/
```

---

## 🚀 Development Phases

### **Phase 1: Setup & Foundation** (Day 1)
**Status**: 🟢 Completed

**Tasks**:
- [x] Initialize Next.js project with TypeScript
- [x] Setup Tailwind CSS
- [x] Install dependencies (QR code library, etc.)
- [x] Create folder structure
- [x] Setup TypeScript interfaces
- [x] Create basic layout and navigation
- [x] Setup Playwright for E2E testing
- [x] Setup Jest for unit testing

**Deliverables**:
- ✅ Working Next.js app with basic routing
- ✅ TypeScript types defined
- ✅ Tailwind configured
- ✅ Testing infrastructure (Jest + Playwright)

---

### **Phase 2: Card Type Selection** (Day 1-2)
**Status**: 🟢 Completed

**Tasks**:
- [x] Design landing page UI
- [x] Create CardTypeSelector component
- [x] Implement navigation to form pages
- [x] Add animations/transitions

**Deliverables**:
- ✅ Interactive card type selection
- ✅ Routing to appropriate form
- ✅ Unit tests for CardTypeSelector component
- ✅ E2E tests for card type selection flow

---

### **Phase 3: Form Development** (Day 2-3)
**Status**: 🟢 Completed

**Tasks**:
- [x] Create BusinessCardForm component
  - Fields: Name, Title, Company, Email, Phone, Website, LinkedIn, Address
- [x] Create BankCardForm component
  - Fields: Account Holder, Bank Name, Account Number, IFSC/Routing, UPI ID
- [x] Implement form validation (using Zod + React Hook Form)
- [x] Add form state management
- [x] Style selection dropdown per card type

**Deliverables**:
- ✅ Functional forms with validation
- ✅ UI style selector (3 styles per card type)
- ✅ Form submission handlers
- ✅ Unit tests for both forms
- ✅ E2E tests for form submission

---

### **Phase 4: Card UI Designs** (Day 3-4)
**Status**: 🟢 Completed

**Tasks**:
- [x] Design 3 business card styles
  - Style 1: Modern minimalist (white background, purple header)
  - Style 2: Professional corporate (structured layout with icons)
  - Style 3: Creative linear (purple linear with glass effect)
- [x] Design 3 bank card styles
  - Style 1: Classic bank card (dark theme, card-like)
  - Style 2: Modern glass morphism (frosted glass effect)
  - Style 3: Sleek dark mode (dark theme with purple accents)
- [x] Implement CardPreview component
- [x] Make cards responsive

**Deliverables**:
- ✅ 6 unique card designs (all using purple theme)
- ✅ Preview component (CardPreview.tsx)
- ✅ All cards are responsive and accessible

---

### **Phase 5: Data Storage & API** (Day 4-5)
**Status**: 🟢 Completed

**Tasks**:
- [x] Setup storage system (in-memory server-side + localStorage client-side for MVP)
- [x] Create API routes for card creation (POST /api/cards)
- [x] Generate unique card IDs (using nanoid)
- [x] Implement GET/POST endpoints
  - POST /api/cards - Create new card
  - GET /api/cards - Get all cards
  - GET /api/card/[id] - Get specific card
- [x] Add error handling and validation

**Deliverables**:
- ✅ Working API endpoints
- ✅ Card storage system (server-side in-memory for MVP)
- ✅ Form integration with API
- ✅ Error handling and validation

---

### **Phase 6: QR Code & Link Generation** (Day 5)
**Status**: 🟢 Completed

**Tasks**:
- [x] Integrate QR code library (qrcode.react)
- [x] Generate unique URLs per card
- [x] Create QR code display component (QRCodeDisplay.tsx)
- [x] Add download QR functionality (PNG download)
- [x] Implement share options (WhatsApp, Email, Twitter, Facebook)
- [x] Create card view page with QR code display

**Deliverables**:
- ✅ QR code generation (high-quality SVG QR codes)
- ✅ Shareable links (copy to clipboard)
- ✅ Download functionality (PNG format)
- ✅ Social sharing integration
- ✅ Card view page implementation

---

### **Phase 7: Card View Page** (Day 6)
**Status**: 🟢 Completed

**Tasks**:
- [x] Create dynamic card view page (/card/[id])
- [x] Fetch card data by ID (via API)
- [x] Display card with selected style (CardPreview component)
- [x] Add "Save to Contacts" button (ContactDownload component)
- [x] Generate vCard (.vcf) file
- [x] Handle invalid/expired links (404 error page)

**Deliverables**:
- ✅ Public card view page
- ✅ Contact download feature (vCard generation)
- ✅ QR code display integration
- ✅ Loading and error states

---

### **Phase 8: Testing & Polish** (Day 7)
**Status**: 🟡 Pending

**Tasks**:
- [ ] Test all card types and styles
- [ ] Test QR code scanning
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Add loading states
- [ ] Error handling refinement

**Deliverables**:
- Fully tested application
- Bug-free experience

---

### **Phase 9: Deployment** (Day 7)
**Status**: 🟡 Pending

**Tasks**:
- [ ] Setup Vercel project
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Test production build
- [ ] Setup custom domain (optional)

**Deliverables**:
- Live application
- Production URL

---

## 📊 Data Models

### Business Card
```typescript
interface BusinessCard {
  id: string;
  type: 'business';
  style: 'style1' | 'style2' | 'style3';
  data: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    website?: string;
    linkedin?: string;
    address?: string;
  };
  createdAt: Date;
}
```

### Bank Card
```typescript
interface BankCard {
  id: string;
  type: 'bank';
  style: 'style1' | 'style2' | 'style3';
  data: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode?: string;
    routingNumber?: string;
    upiId?: string;
  };
  createdAt: Date;
}
```

---

## 🎨 UI Style Themes

### Business Card Styles
1. **Modern Minimalist**: Clean white/black, sans-serif, spacious
2. **Professional Corporate**: Blue accent, structured, formal
3. **Creative Gradient**: Colorful gradients, bold typography

### Bank Card Styles
1. **Classic Bank**: Card-like appearance, traditional layout
2. **Glass Morphism**: Frosted glass effect, modern
3. **Dark Mode**: Sleek dark theme, neon accents

---

## 🔐 Security Considerations

- No sensitive banking credentials stored
- Card IDs are randomly generated (UUID)
- Optional password protection for cards
- Rate limiting on API endpoints
- Input sanitization

---

## 📱 User Flow

1. **User lands on homepage**
2. **Selects card type** (Business/Bank)
3. **Fills in form details**
4. **Selects UI style** from preview options
5. **Generates card** → Gets unique URL + QR code
6. **Downloads/Shares** QR code
7. **Recipients scan** QR code or visit link
8. **View card** and save contact details

---

## 🎯 Success Metrics

- Card creation time < 2 minutes
- QR code scan success rate > 95%
- Mobile responsive on all devices
- Load time < 3 seconds

---

## 🔄 Future Enhancements (Post-MVP)

- [ ] User accounts and card management
- [ ] Analytics (views, scans)
- [ ] Custom branding/logos
- [ ] Social media links
- [ ] Multiple card templates
- [ ] Card editing functionality
- [ ] Export as image/PDF
- [ ] NFC support

---

## 📞 Support & Documentation

- README.md with setup instructions
- API documentation
- Component documentation
- Deployment guide

---

**Last Updated**: November 3, 2025  
**Version**: 0.1.0  
**Status**: In Development - Phases 1-5 Completed (44% Progress)

**Completed Phases**:
- ✅ Phase 1: Setup & Foundation
- ✅ Phase 2: Card Type Selection
- ✅ Phase 3: Form Development
- ✅ Phase 4: Card UI Designs (Purple Theme)
- ✅ Phase 5: Data Storage & API

**Next Phase**: Phase 6 - QR Code Generation