# MRS by Letterboxd — design, version 5

## Intent

A calm cinema companion that helps visitors move from a large library to a film worth watching. Retain the supplied Framer direction—charcoal, orange, warm ivory, editorial serif headings and cinematic imagery—while simplifying controls and introducing a polished appearance switch.

## Brand and appearance

The wordmark reads **MRS**, with no full stop. The site name remains **MRS by Letterboxd**. The existing three-colour favicon is reused beside a semantic text wordmark; no raster text is needed. Fraunces provides display type and DM Sans provides interface type. Fonts are local with OFL licenses. Icons are local Tabler assets with the MIT license.

Dark uses #101112 background, #191a1c panels and warm ivory type. Light uses #f5f3ef background, white panels and #191a1c type. Orange actions remain #ff7900; light-mode text accents use a darker orange for readability. The top appearance control uses a rounded segmented shape, restrained elevation, clear pressed states and sun/moon icons. Device appearance is available in Preferences. Motion can be reduced through Preferences and respects the system reduced-motion media query.

## Journey

1. Entry presents two actual movie cards: RRR and Dune: Part Two. The Enter button opens the sign-in demo.
2. The sign-in card states that real sign-in is under development. Google, Apple, email and guest are all one-click demo choices. No credentials are collected. The navigation labels the state Demo.
3. Optional storage is a separate decision. Entering or choosing a demo option does not imply consent. Essential-only visitors retain full use of features for the current visit.
4. Discover orders films from 2020–2026 with ratings of 4.0+ highest first. All films contains the complete current catalogue, including supplied non-film titles. For you follows explicit preferences and favourite-film attributes.
5. Visitors can save films, mark watched status, update Preferences, or tap Surprise me. The pictured secondary toolbar has been removed.
6. How it works explains the actual experience in three steps. The contact card opens a Gmail draft addressed to founder@ishuu.me; it does not send a message.

## Preferences and privacy

The settings dialog separates Your cinema from Privacy & storage. Cinema controls include multiple languages, preferred genres, excluded genres, default mood, runtime limit, minimum rating, appearance, hide-watched and reduced-motion settings. Genres cannot be both preferred and excluded. Preferences shape For you; Discover retains its fixed selection rule.

The Remember on this device switch controls optional persistence. Save preferences applies choices for this visit when the switch is off, or saves them locally when it is on. The panel also offers reset, export and a confirmation before clearing film data. Export does not imply profile-import support.

The privacy panel shows essential storage as always on and offers one meaningful optional switch. There are no fake analytics or advertising controls because those scripts are absent. Withdrawn permission deletes current and legacy MRS profile keys. Policies explain the demo, local storage, external posters, hosting access and Gmail navigation.

## Responsive behaviour and accessibility

Desktop uses four film cards per row and a three-column language grid. Small screens use two columns and a menu for navigation, with the appearance switch available outside it. The entry artwork becomes an in-flow stack on mobile. Settings are scrollable native dialogs with focus handling, accessible names, real checkbox/select controls, keyboard focus outlines and escape/close controls. Dialog actions remain reachable through scrolling. Poster failures have a readable fallback, and film title buttons support long titles.

## Content rules

Only the current supplied catalogue is used. Its filename is absent from public-facing pages and interface copy. Ratings and rating counts are labelled snapshots rather than live statistics. Stable IDs are retained for films that match earlier saved choices; removed films are not restored to the catalogue. No fabricated rating claims, real-login claims or absolute-security guarantees appear.

## Validation evidence

Evidence captures are saved under `/Users/ishuu/Downloads/mrs-upgrade/`: `v5-entry-dark.png`, `v5-signin-dark.png`, `v5-desktop-dark.png`, `v5-desktop-light.png`, `v5-preferences-dark.png`, and mobile captures. Theme captures must wait for the short colour transition before judging contrast; earlier immediate captures showed intermediate colours, not the settled theme.

See VERIFICATION.md for completed functional/security checks and SECURITY.md for the threat model and limits. This file describes the final implemented design; it does not claim a real authentication system.

## Version 5.1 sign-in

The supplied sign-in reference drives a full-screen dark-teal scene, left-aligned form, warm amber submit action, rounded white fields and social pills, and a large original 3D character on the right. An Image Gen raster supplies the scene; controls remain semantic HTML. Google/Apple/guest preserve MRS options; the main button enters the email demo. The displayed fields are read-only examples, with a working password-visibility control. Recovery explains demo limitations; registration enters the guest demo. On phones the illustration yields to the form to keep every action reachable. Closing sign-in before entry returns to the entrance. The cinema’s selected theme remains unchanged when the demo closes.

## Final element review — 12 October 2026

The release review covers every shared interaction category and records visible controls across 14 rendered states in docs/evidence/element-inventory.json. The tested responsive views remain free of horizontal overflow, with native dialog scrolling and focus containment. No new visual changes were required. The source package includes design evidence, the final review report and deployment instructions alongside this specification.
