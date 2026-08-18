# Watt — Guide for AI Coding Agents

## Project Overview

**Watt** is a website for a concert hall venue in Geneva. The project is a training exercise focused on building semantic HTML and responsive CSS for a modern music venue website.

- **Type**: Static HTML/CSS website
- **Language**: French
- **Target**: Modern, accessible, dark-themed design
- **Images**: Concert/venue photos in root directory (ce-soir.jpg, foule.jpg, scene.jpg, logo.png, logo.svg)

## Project State & Key Gaps

The CSS file contains intentional incomplete sections marked with French comments like "à vous" (for you). These are areas for completion:

### CSS Sections to Complete

1. **Reset section** (top of style.css)
   - Apply CSS reset/normalize approach
   - Preserve existing body styles (dark theme: `#2a2a2e` bg, `#f4f1ea` text)

2. **Header layout** (P5 comment)
   - Three children: logo image, h1 title, nav
   - Use flexbox to arrange horizontally
   - Center alignment, appropriate gap spacing
   - Maintain dark background (`#0a0a0a`)

3. **Navigation styling**
   - Apply flexbox with wrap capability
   - Set gap between links
   - Yellow accent on hover (`#e8ff3d`)

4. **Section padding** (P4 comment)
   - Add `padding-block` to sections for vertical spacing

5. **Hero section (#salle)**
   - Maintain `min-height: 60vh`
   - Complete styling with proper spacing

## Conventions & Patterns

- **Color scheme**: Dark theme (`#2a2a2e` backgrounds, `#f4f1ea` text, `#e8ff3d` accents)
- **Typography**: System fonts with fallback (`system-ui, "Segoe UI", sans-serif`)
- **Semantic HTML**: Use section, header, footer, nav elements
- **Accessibility**: Include `alt` text for images, use `aria-label` for navigation
- **Responsiveness**: Mobile-first approach with viewport meta tag present

## Working with this Project

- **No build step required**: Open `index.html` directly in browser
- **File structure**: Flat HTML + CSS + images in root (simple setup)
- **Preview**: Use Live Server or similar local server for development
- **Language context**: Comments and content are in French; maintain this convention

## Key Files

- [index.html](index.html) — Main document structure (complete)
- [style.css](style.css) — Styling with incomplete sections (needs work)
- [README.md](README.md) — Project context and structure reference

---

**Note**: This is a training project. Focus on clean, semantic code and responsive design principles.
