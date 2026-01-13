<p align="center">
  <img src="./images/opportunities images/OCC Logo.png" alt="Open Computing Club Logo" width="150" height="150"/>
</p>

<h1 align="center">🌐 Open Computing Club (OCC)</h1>

<p align="center">
  <strong>The Space Between Creativity and Code</strong><br/>
  <em>Official Website of Open Computing Club at Universiti Teknologi Petronas (UTP)</em>
</p>

<p align="center">
  <a href="https://hackclubrait.github.io/"><img src="https://img.shields.io/badge/Website-Live-A8F0FF?style=for-the-badge&logo=vercel&logoColor=black" alt="Website Status"/></a>
  <a href="https://github.com/HackClubRAIT/HackClubRAIT.github.io/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/></a>
  <a href="https://github.com/HackClubRAIT/HackClubRAIT.github.io/stargazers"><img src="https://img.shields.io/github/stars/HackClubRAIT/HackClubRAIT.github.io?style=for-the-badge&color=yellow" alt="Stars"/></a>
  <a href="https://github.com/HackClubRAIT/HackClubRAIT.github.io/network/members"><img src="https://img.shields.io/github/forks/HackClubRAIT/HackClubRAIT.github.io?style=for-the-badge&color=blue" alt="Forks"/></a>
  <a href="https://github.com/HackClubRAIT/HackClubRAIT.github.io/issues"><img src="https://img.shields.io/github/issues/HackClubRAIT/HackClubRAIT.github.io?style=for-the-badge&color=orange" alt="Issues"/></a>
</p>

---

## 📖 About

**Open Computing Club (OCC)** is a vibrant tech community at **Universiti Teknologi Petronas (UTP)** dedicated to fostering innovation, open-source contributions, and collaborative learning. We bridge the gap between creativity and code, empowering students to build, learn, and grow together.

Our mission is to:
- 🚀 Flourish the open-source culture within our campus
- 💡 Create opportunities for learning and skill development
- 🤝 Build a supportive community of tech enthusiasts
- 🏆 Organize hackathons, workshops, and tech events

---

## ✨ Features

### 🎨 Modern Design System
- **Glassmorphism UI** with elegant blur effects and glass borders
- **Dynamic CSS Variables** for consistent theming (`--primary`, `--glass-bg`, etc.)
- **Responsive Design** optimized for all screen sizes
- **Custom Color Palette** featuring signature cyan (`#A8F0FF`) accent

### 🎬 Rich Animations
- **Plasma Background** - Interactive animated backgrounds powered by Three.js
- **Click Spark Effects** - Delightful micro-interactions on user clicks
- **Blur Text Animations** - Cinematic text reveal effects
- **AOS (Animate On Scroll)** - Smooth scroll-triggered animations
- **Floating Elements** - Dynamic bento grid with floating cards

### 📄 Pages
| Page | Description |
|------|-------------|
| 🏠 **Home** | Hero section with bento grid, vision statement, and value proposition |
| 📅 **Ongoing Events** | Current events and activities |
| 📜 **Past Events** | Archive of previous events and achievements |
| 👑 **High Committees** | Leadership team profiles |
| 👥 **Committees** | All committee members and contributors |
| 📝 **Blogs** | Technical articles and community updates |
| 📧 **Contact/Join Us** | Contact form and information to get involved |

### ⚡ Performance
- Custom preloader with progress animation
- Smooth page transitions
- Optimized image loading
- Scroll progress indicator

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="48" height="48" alt="HTML5"/>
<br/><strong>HTML5</strong>
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="48" height="48" alt="CSS3"/>
<br/><strong>CSS3</strong>
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="48" height="48" alt="JavaScript"/>
<br/><strong>JavaScript</strong>
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="48" height="48" alt="Bootstrap"/>
<br/><strong>Bootstrap 4</strong>
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" width="48" height="48" alt="Three.js"/>
<br/><strong>Three.js</strong>
</td>
</tr>
</table>

### Libraries & Tools
- **[Bootstrap 4](https://getbootstrap.com/)** - Responsive grid and components
- **[AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)** - Scroll animations
- **[Three.js](https://threejs.org/)** - 3D graphics and plasma effects
- **[Remix Icons](https://remixicon.com/)** - Beautiful icon library
- **[Font Awesome](https://fontawesome.com/)** - Icon toolkit
- **[Google Fonts](https://fonts.google.com/)** - Typography (Inter, Outfit, Silkscreen)
- **Express.js** - Backend server (optional)
- **PostgreSQL** - Database (optional)

---

## 📁 Project Structure

```
occ_club_web/
├── HackClubRAIT.github.io-main/
│   ├── css/                    # Modular CSS files
│   │   ├── global.css          # Global styles and utilities
│   │   ├── home.css            # Homepage specific styles
│   │   ├── team.css            # Team page styles
│   │   ├── contact.css         # Contact page styles
│   │   ├── blogs.css           # Blog page styles
│   │   ├── ongoing.css         # Ongoing events styles
│   │   ├── past.css            # Past events styles
│   │   └── contributer.css     # Contributors page styles
│   ├── js/                     # JavaScript modules
│   │   ├── plasma.js           # Animated plasma background
│   │   ├── click-spark.js      # Click interaction effects
│   │   ├── blur-text.js        # Text animation effects
│   │   └── gradual-blur.js     # Scroll blur transition
│   ├── images/                 # Image assets
│   ├── index.html              # Homepage
│   ├── ongoing.html            # Ongoing events page
│   ├── past.html               # Past events page
│   ├── team.html               # High committees page
│   ├── contributer.html        # Committees/contributors page
│   ├── blogs.html              # Blog page
│   ├── contact.html            # Contact/Join us page
│   ├── styles.css              # Main stylesheet
│   ├── preloader.css           # Preloader styles
│   ├── preloader.js            # Preloader logic
│   ├── antigravity.js          # Hero background animation
│   ├── text-animations.js      # Text animation engine
│   ├── page-transition.js      # Page transition effects
│   ├── team.json               # Team data
│   ├── contributer.json        # Contributors data
│   ├── CODE_OF_CONDUCT.md      # Community guidelines
│   ├── LICENSE                 # MIT License
│   └── vercel.json             # Vercel deployment config
├── components/                  # Reusable components
├── server.js                    # Express.js server
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher) - Optional, for server
- [Git](https://git-scm.com/) - Version control
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HackClubRAIT/HackClubRAIT.github.io.git
   cd HackClubRAIT.github.io
   ```

2. **Open locally (Static)**
   Simply open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **With Node.js Server (Optional)**
   ```bash
   npm install
   npm start
   ```

4. **Visit the website**
   Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🤝 Contributing

We welcome contributions from everyone! OCC thrives on community involvement.

### How to Contribute

1. **Fork** the repository
   
2. **Clone** your forked copy
   ```bash
   git clone https://github.com/<your-username>/HackClubRAIT.github.io.git
   cd HackClubRAIT.github.io
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/HackClubRAIT/HackClubRAIT.github.io.git
   ```

4. **Sync with upstream**
   ```bash
   git pull upstream main
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Make your changes** and commit
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

7. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** with a clear description of your changes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

---

## 📞 Contact Us

<table>
<tr>
<td align="center">
<strong>Hannah Jeevan</strong><br/>
📱 <a href="tel:+60111451531">+60 11-1145 1531</a><br/>
💬 <a href="https://wa.me/60111451531">WhatsApp</a>
</td>
<td align="center">
<strong>Harresh Varma</strong><br/>
📱 <a href="tel:+60163274613">+60 16-327 4613</a><br/>
💬 <a href="https://wa.me/60163274613">WhatsApp</a>
</td>
</tr>
</table>

### Connect With Us

<p align="left">
  <a href="https://github.com/HackClubRAIT"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
  <a href="https://www.instagram.com/utp.occ"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/></a>
  <a href="https://www.linkedin.com/company/open-computing-club/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
</p>

### Location

📍 **Universiti Teknologi Petronas**<br/>
32610 Seri Iskandar, Perak, Malaysia

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Hack Club](https://hackclub.com/) for the inspiration
- All our amazing [contributors](https://github.com/HackClubRAIT/HackClubRAIT.github.io/graphs/contributors)
- The open-source community for the incredible tools and libraries

---

<p align="center">
  <strong>Made with 💙 by Open Computing Club</strong><br/>
  <em>© 2025 Open Computing Club. All Rights Reserved.</em>
</p>

<p align="center">
  <a href="#-open-computing-club-occ">⬆️ Back to Top</a>
</p>
