# Driftpad

A mindful digital drawing app that combines creativity with zen philosophy. Draw, let go, and find your flow.

![Driftpad](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-ISC-blue) ![Website](https://img.shields.io/badge/Website-driftpad.app-orange)

## 🌊 What is Driftpad?

Driftpad is a web-based drawing application that encourages mindful creativity through three unique modes:

- **🎨 Prompt Mode**: Get inspired by creative prompts like "elephant with a flower hat"
- **✏️ Complete Drawing**: Finish partially drawn shapes
- **🧘 Freehand Mode**: Mindful prompts that encourage breaks and reflection

## ✨ Key Features

### 🎨 Advanced Drawing Engine
- **Watercolor Brush System**: Pressure-sensitive drawing with natural ink effects
- **Zen Color Palette**: 5 carefully selected grayscale tones
- **Mobile-Optimized**: Touch-friendly interface for phones and tablets

### 🧠 Mindfulness Integration
- **Smart Prompts**: System suggests breaks for long drawing sessions
- **Session Awareness**: Prompts adapt based on your drawing time
- **Impermanence**: Drawings fade automatically, encouraging non-attachment

### 🌍 Community Gallery
- **Public Gallery**: Share your creations anonymously
- **Community Inspiration**: See what others have drawn
- **Privacy-First**: Uses anonymous UUIDs for user identification

## 🚀 Live Demo

Visit **[driftpad.app](https://driftpad.app)** to start drawing!

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with zen-inspired design
- **Analytics**: Umami
- **Deployment**: Static hosting

## 🎯 Philosophy

Driftpad embodies a zen approach to digital creativity:

- **Process over Product**: Focus on the act of drawing, not the result
- **Mindful Breaks**: Take time to breathe and reflect
- **Community**: Share creativity without ego

## 📱 Mobile Experience

Optimized for touch devices with:
- Full-screen drawing canvas
- Pressure-sensitive brush strokes
- Gesture-friendly controls
- Responsive design for all screen sizes

## 🔧 Development

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/apandji/driftpad.git
cd driftpad
```

2. Open `index.html` in your browser or serve locally:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

3. Visit `http://localhost:8000`

### Environment Variables

The app uses Supabase for data storage. To set up your own instance:

1. Create a Supabase project
2. Set up the database schema (see `setup_prompts.sql`)
3. Update the Supabase URL and key in `index.html`

## 📊 Analytics

Driftpad uses Umami for privacy-focused analytics to understand user behavior and improve the experience.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by zen philosophy and mindfulness practices
- Built with love for the creative community
- Special thanks to all the beta testers and contributors

---

**Find your flow. Let it go. 🎨**

*Driftpad - Where creativity meets mindfulness*
