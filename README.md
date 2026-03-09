# 💰 Isiteki - Personal Finance Tracker

A modern, mobile-first personal finance tracker built with Next.js and Google Sheets. Track your expenses and income with a beautiful, intuitive interface.

![Isiteki App](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with a responsive layout
- 🎨 **Modern UI** - Clean, professional interface with glassmorphism effects
- ⚡ **Fast & Simple** - Quick expense/income registration with minimal required fields
- 📊 **Google Sheets Integration** - All data automatically saved to your Google Sheets
- 🌙 **Dark Theme** - Beautiful dark mode interface
- 🔒 **Secure** - API routes protect your Google Sheets URL
- 🇵🇪 **Peruvian Soles (S/)** - Configured for Peruvian currency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google account
- Basic knowledge of Google Sheets and Apps Script

### 1. Clone the Repository

```bash
git clone https://github.com/Jcdev04/isiteki.git
cd isiteki
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Google Sheets

#### 3.1 Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Isiteki - Personal Finance" (or whatever you prefer)
4. Create a sheet named "Enero" (or your preferred month name)
5. Add the following headers in row 1:
   - **Column A**: Fecha
   - **Column B**: Tipo
   - **Column C**: Categoría
   - **Column D**: Concepto
   - **Column E**: Medio de Pago
   - **Column F**: Monto

#### 3.2 Set Up Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Change "Enero" to your sheet name if different
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Enero");

    // Parse the data sent from Next.js
    var data = JSON.parse(e.postData.contents);

    // Append data to sheet
    sheet.appendRow([
      data.fecha,       // Column A: Date (YYYY-MM-DD)
      data.tipo,        // Column B: Type (gasto/ingreso)
      data.categoria,   // Column C: Category
      data.concepto,    // Column D: Description
      data.medioPago,   // Column E: Payment Method
      data.monto        // Column F: Amount
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

4. Click **Save** (💾 icon)
5. Click **Deploy** → **New deployment**
6. Click the gear icon ⚙️ next to "Select type"
7. Choose **Web app**
8. Configure:
   - **Description**: Isiteki Finance Tracker
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Click **Deploy**
10. **Copy the Web App URL** - you'll need this for the next step

### 4. Configure Environment Variables

1. Create a file named `.env.local` in the root directory
2. Add the following:

```env
NEXT_PUBLIC_SHEETS_URL=YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
```

Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied from the Apps Script deployment.

**Example:**
```env
NEXT_PUBLIC_SHEETS_URL=https://script.google.com/macros/s/AKfycbx.../exec
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Select Transaction Type**: Choose between Expense (💸 Gasto) or Income (💰 Ingreso)
2. **Enter Amount**: Input the amount in Peruvian Soles (S/)
3. **Choose Category**: Select from predefined categories (Food, Transport, Home, etc.)
4. **Add Details** (Optional):
   - Description/Concept
   - Payment method
   - Date (defaults to today)
5. **Submit**: Click the green button to save to Google Sheets

## 🎨 Customization

### Change Currency

To change from Peruvian Soles (S/) to another currency:

1. Open `app/page.tsx`
2. Find line ~112:
```tsx
<span className="absolute left-5 text-2xl font-bold text-[#cfd73f]">
  S/  {/* Change this to your currency symbol */}
</span>
```

### Modify Categories

Edit the `CATEGORIAS` array in `app/page.tsx`:

```tsx
const CATEGORIAS = [
  { id: "comida", label: "🍔 Comida", color: "#ff8c42" },
  // Add or modify categories here
];
```

### Change Colors

The app uses these main colors:
- **Primary Green**: `#cfd73f`
- **Secondary Purple**: `#9b8dd8`

Update them in `app/page.tsx` to match your preference.

## 🏗️ Project Structure

```
isiteki/
├── app/
│   ├── api/
│   │   └── sheets/
│   │       └── route.ts        # API route for Google Sheets
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main form component
├── components/
│   └── ui/                     # shadcn/ui components
├── lib/
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
└── package.json
```

## 🔒 Security Notes

- The Google Sheets URL is stored in environment variables
- API routes handle the communication with Google Sheets server-side
- Never commit `.env.local` to version control
- The Apps Script is set to "Anyone" access, but only accepts POST requests with the correct data structure

## 🛠️ Built With

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Manrope Font](https://fonts.google.com/specimen/Manrope) - Typography
- [Google Sheets API](https://developers.google.com/sheets/api) - Data storage

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Jcdev04**
- GitHub: [@Jcdev04](https://github.com/Jcdev04)

## 🙏 Acknowledgments

- Design inspired by modern fintech apps
- Built with love for personal finance tracking

---

**Note**: This app stores data in Google Sheets. Make sure to keep your spreadsheet private and secure. Consider implementing additional authentication if you plan to use this in production.
