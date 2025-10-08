# Achieving a Multi-Platform Fusion

# Overview

**Autodesk Fusion** was a desktop-only CAD application with a complex, dense interface. Over three years, I led the transformation to bring powerful 3D design and manufacturing tools to mobile, tablet, and web for the first time—creating a unified, device-agnostic experience that scales seamlessly across platforms.

**Role:** Lead Product Designer

**Duration:** 3 years

**Platform:** Web, iOS, Android, Desktop

---

# The Challenge

Fusion's competitors had already moved to multi-platform experiences, and our users were demanding more flexibility. Manufacturing engineers needed mobile access on the factory floor, distributed teams needed workflow continuity across devices, and product designers wanted tablet flexibility for creative work.

**The business risk was clear:** Without a multi-platform solution, we faced a potential 5-10 year subscription loss to mobile-first competitors while missing opportunities to grow our user base.

The core design challenge was even more complex: _How do we transform a desktop-only CAD application—built for mouse and keyboard precision—into a unified responsive experience that maintains its power while scaling across touch, stylus, and traditional input methods?_

---

# My Role & Approach

As **Lead Product Designer** on this multi-year initiative, I owned the strategic vision and end-to-end design. This required:

- **Product & design strategy** — Defining the north star vision and multi-year roadmap
- **Information architecture** — Restructuring complex workflows for cross-platform use
- **Vision & strategy** — Creating frameworks other Autodesk teams could build upon
- **End-to-end design** — From initial concepts through production-ready specs
- **User research & testing** — Leading workshops, interviews, and validation studies
- **Prototyping** — Building interactive prototypes and coding in QML
- **Cross-functional leadership** — Collaborating with 2 senior UX designers, 2 researchers, multiple PMs, and various development teams

To lead this project effectively, I needed deep understanding of Fusion's entire ecosystem and internal teams' future needs. I gathered feedback through bi-weekly meetings with other UX teams, workshops, and asynchronous presentations using FigJam boards. I also advised the Autodesk Design System team and integrated new patterns into the existing desktop experience.

---

# Research & Discovery

## Understanding User Needs

I ran a customer-focused workshop with 20 users to understand their device-specific needs. We explored seven dimensions of software adoption using a practitioner value framework, focusing on:

- **User interface & experience** — Ease of use and learning curve
- **Performance** — Reliability and processing speed
- **Workflow integration** — How tools fit into existing processes
- **Cross-device continuity** — Switching between devices seamlessly

### Key Findings

**Tablet:** High demand for modeling, annotation, and CNC updates. Most 'authoring' personas wanted Fusion on tablets.

**Browser:** Preferred for flexibility, though users had concerns about performance.

**Phone:** Primarily used for sharing, quick edits, and annotations. Users would edit "in a pinch" but didn't expect full authoring capabilities.

**Cross-device workflow:** Users frequently switched devices and locations for collaboration—the same person might spend hours designing on desktop, edit on a tablet for an hour, then make a quick fix on mobile.

## The Strategic Insight

The breakthrough came from recognizing a fundamental truth: **tasks don't differ across devices—they scale.**

Users wanted to perform the same actions on all platforms, but the complexity scaled with mobility. This insight led to my core strategic framework: a device-agnostic interaction model. Instead of building separate device-specific experiences, we would create one unified responsive system supporting touch, stylus, mouse, and keyboard.

---

# Defining Success

My approach was rooted in extensive user research and competitive analysis, leading to four core strategic pillars:

**Drive User Adoption**

Increase engagement and active users across all new device platforms.

**Enable Cross-Device Workflows**

Seamlessly transition design tasks between desktop, web, and mobile.

**Improve Task Efficiency**

Optimize key design and manufacturing workflows for faster completion.

**Create a Scalable Framework**

Develop a robust, adaptable system for future product expansion.

---

# Design Solution: Responsive Architecture

Adopting progressive disclosure as a core principle, I developed an architecture that scales intelligently—keeping Fusion's power accessible on every device while using available space effectively on larger screens.

The key was creating a system where UI elements adapt based on:

- Available screen real estate
- Primary input method (touch vs. mouse)
- User's current workflow context
- Device ergonomics

---

# Deep Dive: The Toolbar Redesign

The toolbar is Fusion's command center—central to nearly every workflow. Transforming it was critical.

## The Problem

The legacy toolbar had several issues:

- Consumed too much vertical space on smaller devices
- Commands became buried unpredictably when horizontal space narrowed
- Fixed top position failed to adapt across screen sizes
- Inconsistent across different workspaces
- Not scalable for touch interfaces

## Research: Optimal Placement

I approached toolbar placement from an ergonomic perspective, considering how users naturally interact with each device type.

Through user testing with 22 participants across design, manufacturing, engineering, and electronics roles, I discovered:

- **Tablet:** Left placement won decisively—users wanted easy thumb access in both portrait and landscape
- **Desktop/Web:** Top placement aligned with familiar patterns
- **Mobile:** Results were mixed between left/top, so I flagged for ongoing testing

## Information Architecture

Before redesigning the interface, I needed to solve the information architecture. I took a multifaceted approach, analyzing:

**Usage** — How frequently is each command used? (Analytics review)

**Customer expectation** — Where do users expect to find it? (Card sorting with 22 users)

**Hierarchy** — Application-level vs. document-level vs. workspace-specific

**New user friendliness** — Will this be intuitive for less technical users?

### Card Sorting Insights

Users classified tools by function and usage. They wanted related tools grouped together, not scattered across different menus. This led to reorganizing:

- **Navigation commands** → Near the ViewCube
- **View options** → Grouped in ViewCube menu
- **Display settings** → Directly on toolbar
- **Rarely-used settings** → Moved to preferences
- **Named views** → Relocated from model browser to view menu

## Design Iterations

### Early Explorations

I explored several approaches:

- **Vertical toolbar with vertical tabs** — Rejected after learning other Autodesk products received negative feedback on this pattern
- **Condensed horizontal toolbar** — Removed labels, but dropdown arrows caused misalignment
- **Workspace switcher in top bar** — Tested well but ultimately moved back to toolbar to maintain proper information hierarchy

### Breakthrough: Scrollable Toolbar

I built a prototype with scrollable functionality and visual affordance (drop shadow at bottom edge). However, in testing with 5 users, participants consistently missed the scrollable function—revealing a critical usability gap.

### Final Solution

After analyzing modern CAD tools, I recognized a pattern: most prioritize condensed, icon-driven interfaces with overflow menus.

I designed a new toolbar where:

- All commands are accessible through a dropdown on the right
- As the toolbar narrows, it predictably hides commands from the right
- Overflow dropdown stays in the same place
- Users can search and browse with collapsible sections and grid view
- Toolbar can collapse entirely to maximize canvas space

This solution is scalable, responsive, maintains a small footprint, and is both searchable and browsable.

## Validation

I conducted moderated testing with 5 users:

- **5 of 5** successfully switched from Constrained Orbit to Free Orbit
- **4 of 5** successfully changed Camera to Perspective
- The navigation toolbar fit users' mental models, confirming prior research

_"Tools that involve specific views of the model go well with the viewcube area."_ — User testing participant

---

# Deep Dive: 2D Sketch Workflow

One of the toughest challenges was designing 2D Sketching for touch devices. 2D sketching is like creating architectural plans for 3D shapes—precision is essential.

## The Challenge

The legacy workflow relied heavily on:

- Cursor and hover feedback
- Text inputs for exact values
- Keyboard shortcuts

Without a keyboard and mouse, I needed to completely rethink the experience.

## The Precise Cursor

After reviewing competitors, I noticed they placed a precise cursor just above the finger, functioning like a mouse cursor.

### Design Iterations

I explored multiple cursor designs—through internal design critiques, I kept returning to plus (+) variants as most precise and least intrusive. The breakthrough came with a centered square inside the plus icon, providing optimal precision without compromising canvas clarity.

### Interaction Pattern

- **Double-tap** activates the precise cursor
- Users position the cursor
- **Lift finger** to complete selection

Although some teammates preferred press-and-hold, I reserved that gesture for touch-based right-click to maintain interaction consistency throughout the app.

### Validation

Testing with 5 users showed the double-tap gesture became second nature after a single demonstration, with a usefulness rating of **4.1 out of 5**. Users repeatedly used it throughout the prototype session.

## Exiting Sketch Mode

Using state charts to map user flows, I uncovered a critical gap: the only way to exit a Sketch tool was pressing Escape.

I needed an exit pattern that worked across all input types. The solution:

- Blue call-to-action button with white icon
- Placed directly in toolbar
- Same icon and button style connects toolbar and command panel
- Makes it immediately clear users are in a special mode

Testing confirmed this approach was intuitive and well-received.

## Supporting Features

**Canvas snack bars** — Display the active tool at top center, providing clarity without cursor changes

**Numeric keypad** — Compact input for precise values without triggering the full OS keyboard

## Validation

Testing the complete sketch workflow with 5 users:

- **4 of 5** successfully completed drawing a rectangle on tablet
- Participants liked the numeric keyboard
- Overall satisfaction: **4.4 out of 5**

---

# Exploring Beyond Constraints

During this project, I stepped back for a thought experiment: _What if Fusion was designed from scratch today with multi-device in mind from the start?_

Freed from legacy constraints, I explored:

- Unconventional interaction patterns
- Motion design principles for progressive disclosure
- Alternative visual styles and hierarchies
- High and low density modes
- Light and dark themes

Drawing from these experimental designs, I integrated:

- Rounded corners and subtle drop shadows
- Floating elements creating an open, modern feel
- Spaciousness and accessibility as core principles

The feedback from leadership and users indicated I had captured Fusion's future style and direction—concepts that influenced the broader product vision.

---

# Impact & Results

This project delivered significant organizational impact:

**Production-Ready Frameworks**

Two device-agnostic development frameworks now used across Autodesk

**Functional Prototypes**

Two fully functional Fusion POCs validated on Surface tablet

**Design System Contributions**

Multi-platform guidelines, architecture, and reusable components that enhanced Autodesk's design system

**Team Enablement**

Enabled two new apps built by other teams using these patterns

**Strategic Vision**

Created a North Star vision deck and demo that leadership now uses to drive Fusion's strategic direction for the next five years

---

# Key Learnings

**Innovation requires stepping outside conventional thinking.**

When I gave myself permission to explore untested ideas and unconventional approaches, it became easier to narrow in on solutions that were not only inventive but also simpler and more intuitive for users.

**Users are your best collaborators.**

This project reaffirmed the importance of engaging directly with users and actively listening to their insights. When prompted with thoughtful questions, users consistently offered valuable feedback and innovative ideas that shaped the final solution.

**Tasks don't differ across devices—they scale.**

This fundamental insight unlocked the entire strategy. Rather than creating separate experiences for each platform, recognizing that users want the same capabilities at different scales of complexity led to a truly unified, scalable solution.
