# Accessibility Audit: Chip Components

## Overview
This document validates the accessibility of all chip components in the Archangel project against WCAG 2.1 guidelines.

---

## 1. Client Chips (`.client-chip`)

**Location**: [app/components/ProjectClients.tsx](app/components/ProjectClients.tsx), [app/globals.css](app/globals.css#L522)

### ✅ Passes

- **Semantic HTML**: Non-interactive `<span>` elements are appropriate
- **ARIA Label**: Parent `<ul>` has `aria-label` ("Associated phrases" or "Clients")
- **List Structure**: Properly wrapped in `<ul>` and `<li>` elements
- **Descriptive Text**: Contains meaningful text content

### ⚠️ Issues Found

#### 1. **Color Contrast Insufficient** (WCAG 2.1 SC 1.4.3 - Level AA)
   - **Problem**: Text colors on light backgrounds may not meet AA contrast ratios
   - **Examples**:
     - Muted tone: `color: var(--muted)` on `background: rgba(94, 91, 85, 0.09)` - very low contrast
     - Amber tone: Dark amber on `rgba(143, 95, 0, 0.12)` - potentially low contrast
   - **Required**: Minimum 4.5:1 for normal text (AA), 7:1 (AAA)
   - **Recommendation**: Either darken text colors or increase background opacity

#### 2. **Small Font Size** (WCAG 2.1 SC 1.4.4)
   - **Problem**: Font size is 0.62rem (≈9.92px), which is below standard readability
   - **Impact**: Difficult to read, especially for users with low vision
   - **Recommendation**: Increase to minimum 0.75rem (12px) for body text

#### 3. **Small Touch Target** (WCAG 2.1 Level AAA - Recommendation)
   - **Problem**: `min-height: 1.55rem` (≈24.8px) is below 44px recommendation
   - **Impact**: Difficult to click/tap on mobile and for users with motor disabilities
   - **Recommendation**: Consider increasing min-height to 44px or at least 32px minimum

#### 4. **Text Transformation Issues** (Best Practice)
   - **Problem**: `text-transform: uppercase` with `letter-spacing: 0.08em` can reduce readability
   - **Impact**: All-caps text is harder to scan than title case
   - **Recommendation**: Consider using title case instead of uppercase

---

## 2. Status Chips (`.status-chip`)

**Location**: [app/page.tsx](app/page.tsx#L143), [app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx#L57), [app/globals.css](app/globals.css#L647)

### ✅ Passes

- **Semantic HTML**: Non-interactive `<span>` elements
- **Border Definition**: `border: 1px solid currentColor` provides visible distinction

### ❌ Critical Issues

#### 1. **Color-Only Differentiation** (WCAG 2.1 SC 1.4.1 - FAILURE)
   - **Problem**: Status information conveyed ONLY through color:
     - `.status-live` → green
     - `.status-progress` → amber
     - `.status-complete` → muted
   - **Impact**: Users with color blindness cannot distinguish statuses
   - **Violation**: WCAG 2.1 SC 1.4.1 (Use of Color) - MUST have additional indicator
   - **Fix**: Add text, icon, or pattern beyond just color

#### 2. **Missing Programmatic Context**
   - **Problem**: No `aria-label` or `aria-describedby` on chips
   - **Impact**: Screen reader users only hear the status text without full context
   - **Recommendation**: Add `aria-label` like `aria-label="Status: In Progress"`

#### 3. **Small Font Size** (WCAG 2.1 SC 1.4.4)
   - **Problem**: 0.62rem (≈9.92px) is very small
   - **Recommendation**: Increase to 0.75rem minimum

#### 4. **Insufficient Touch Target**
   - **Problem**: `min-height: 1.65rem` is below 44px standard
   - **Recommendation**: Increase to support touch accessibility

---

## 3. Color Contrast Verification

### Client Chips - Estimated Contrast Ratios
| Tone | Text Color | Background | Estimated Ratio | Status |
|------|-----------|-----------|-----------------|--------|
| Muted | --muted | rgba(94,91,85,0.09) | ~2:1 | ❌ FAIL |
| Ink | --ink | rgba(16,16,16,0.08) | ~2.5:1 | ❌ FAIL |
| Blue | --blue-dark | rgba(0,94,168,0.1) | ~3:1 | ❌ FAIL |
| Green | --green | rgba(46,112,68,0.1) | ~3:1 | ❌ FAIL |
| Red | --red | rgba(179,25,66,0.09) | ~3:1 | ❌ FAIL |
| Amber | --amber | rgba(143,95,0,0.12) | ~2.5:1 | ❌ FAIL |

**Recommendation**: Increase background opacity or darken text colors to achieve 4.5:1 minimum

### Status Chips - Color Accessibility
- `.status-live` (green): Adequate contrast but lacks additional indicator
- `.status-progress` (amber): Adequate contrast but lacks additional indicator
- `.status-complete` (muted): Poor contrast, needs additional indicator

---

## 4. Recommended Fixes

### Priority 1 (Critical)

1. **Fix Color-Only Status Communication**
   ```tsx
   // BEFORE:
   <span className={`status-chip ${statusClass(project.status)}`}>
     {project.status}
   </span>
   
   // AFTER:
   <span 
     className={`status-chip ${statusClass(project.status)}`}
     aria-label={`Status: ${project.status}`}
   >
     {project.status}
   </span>
   ```

2. **Improve Client Chip Contrast**
   - Increase background opacity (e.g., rgba → 0.15-0.2)
   - Or darken text colors
   - Or use darker background with light text

### Priority 2 (Important)

3. **Increase Font Sizes**
   - Client chips: 0.62rem → 0.75rem
   - Status chips: 0.62rem → 0.75rem

4. **Increase Touch Targets**
   - Client chips: min-height 1.55rem → 2rem (minimum)
   - Status chips: min-height 1.65rem → 2rem (minimum)

### Priority 3 (Best Practice)

5. **Review Text Transformation**
   - Consider using title case instead of uppercase
   - Reduces cognitive load for users with reading disabilities

6. **Add Icon Indicators for Status**
   - Use symbols: ✓ (complete), ⟳ (in progress), ● (live)
   - Provides non-color distinction for colorblind users

---

## 5. Testing Recommendations

1. **Color Contrast Testing**
   - Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Use WAVE browser extension for automatic checks
   - Test with Chrome DevTools Accessibility Inspector

2. **Keyboard Navigation**
   - Verify chips are properly wrapped in accessible containers
   - If chips become interactive, ensure proper ARIA roles

3. **Screen Reader Testing**
   - Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)
   - Verify all status information is communicated verbally

4. **Color Blindness Simulation**
   - Use Coblis: https://www.color-blindness.com/coblis-color-blindness-simulator/
   - Verify all information is distinguishable by colorblind users

5. **Responsive Testing**
   - Verify touch targets are adequate on mobile (44x44px minimum)
   - Test font readability at different zoom levels

---

## Summary

| Component | Issues Found | Severity |
|-----------|-------------|----------|
| Client Chips | 4 | ⚠️ Medium |
| Status Chips | 4 | ❌ High |
| **Total** | **8** | **Mixed** |

**Overall WCAG 2.1 Compliance**: ❌ **Not Compliant**
- Critical violations: Color-only status differentiation
- Important issues: Contrast ratios, font sizes, touch targets
