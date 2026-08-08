# All In One Image Viewer
# Image viewer

**Project Slug/Prefix:** `bpivb` (bPlugins Image Viewer Block)
This standardized prefix is used across the plugin for block namespaces (`bpivb/`), PHP constants (`BPIVB_`), CSS classes (`bpivb-`), and Custom Post Types (`post_type=bpivb`).

## Free-only plugin

This plugin ships **one edition and it is free**. There is no Pro build, no license layer, and no upsell UI:

* The nine Pro-only viewer styles (Transform, Masking, Viewport, Multi Image Overlay, Aspect Ratio, Hotspot Annotations, Zoom Pan Viewer, Comparison Slider, Interactive Image Accordion) and their attributes, settings panels, theme components, and CSS were removed.
* The full Freemius SDK (`vendor/freemius/`) and `includes/LicenseActivation.php` were removed. Only **Freemius Lite** (`vendor/freemius-lite/`) remains, and it handles opt-in telemetry only — no plans, licensing, or checkout.
* `BPIVB_HAS_PRO`, `bpivbIsPremium()`, and the `bpivbPipecheck` JS global are gone, along with the `BControlPro` / `ProModal` gating, the "Pro" badges in the theme switcher, the frontend "Upgrade now" overlay, and the Pricing / Feature Comparison / Activation dashboard routes.

When editing this plugin, do **not** reintroduce Pro gating or the full Freemius SDK.

## Best Practices & Security

Uses `wp_add_inline_script()` (not the deprecated `wp_localize_script()`) to pass JavaScript data to both the editor and frontend scripts.

```
Old: wp_localize_script(...)
New: wp_add_inline_script(...)
```


## 1. What does this plugin do? (Core Functionality)
This is a **Gutenberg Block Plugin** built for WordPress. Its main purpose is to present images on a website through various engaging and interactive features, moving away from traditional static image displays.

Users can utilize the following four viewer modes:
* **Zoom:** Zoom and pan into specific parts of an image, with controls for pan/zoom toggles, axis locks, start scale, and zoom step.
* **Magnify:** A magnifying-glass effect over the image, with adjustable lens size, speed, and timeout.
* **Image Map:** Place clickable, drag-and-drop map areas over an image, each with its own link, title, target, shape, size, and position.
* **Pano or Rotation:** A 360° panorama viewer with custom width/height, auto-rotate toggle, rotate speed, and optional controls.

This plugin is highly effective for e-commerce sites, photography portfolios, or real estate websites.

## 2. Folder & File Structure
Here is the purpose of each folder and file according to your project's directory:

### Folders:
* **`src/` (Source Folder):** This is the most crucial folder for developers. All React (JavaScript) and SCSS (styling) code for the Gutenberg block resides here.
  * `block.json`: Defines the block's name, icon, and attributes (settings).
  * `index.js` & `Edit.js`: Controls how the block appears and functions within the WordPress editor (Backend).
  * `Components/Settings/Settings.js`: Manages the options in the editor's right-hand sidebar (e.g., toggling zoom on/off).
  * `Components/Theme/`: The four viewer components used in the editor preview.
  * `Frontend/` & `Frontend/view.js`: Contains the JavaScript code governing how the viewers work on the live website (Frontend).
  * `render.php`: Determines how the block's HTML is rendered on the live site (for Dynamic blocks).
* **`includes/`:** Contains the core PHP classes and functions for the plugin.
  * `class-bpivbPlugin.php`: Handles core functionality, loads scripts, and registers the block.
  * `class-bpivbAdminMenu.php`: Registers the Help And Demo dashboard page and passes its data to React.
  * `class-bpivbOptions.php`: Stores the plugin's options (e.g. delete-data-on-uninstall).
  * `class-shortCode.php`: Manages shortcode-related tasks.
* **`vendor/`:** Stores third-party PHP libraries. Only **Freemius Lite** is kept here, for opt-in telemetry.
* **`assets/`:** Houses necessary static files for the plugin, such as images, fonts, or admin panel icons.

### Root Files:
* **`image-viewer.php`:** The main plugin file. WordPress reads this file first. It contains the plugin name, version, and author details, and it initiates the loading of `includes` files and Freemius Lite.
* **`image-viewer-block.php`:** Registers the block, its script/style handles, and the image-proxy REST route used by the panorama viewer.
* **`package.json`:** The Node.js configuration file. It defines your project's name, dependency list, and scripts (e.g., `npm start`).
* **`readme.txt`:** The official documentation for the WordPress directory. It contains the plugin description, features, and changelog (update history).

## 3. Step-by-Step Workflow
* **Step 1:** When a user installs and activates the plugin, WordPress first runs `image-viewer.php`.
* **Step 2:** Next, it calls the `includes/class-bpivbPlugin.php` file. This file notifies WordPress, "I have a Gutenberg block with compiled code."
* **Step 3:** When a user goes to a page or post and adds the **Image Viewer** block, the code in `src/Edit.js` and `src/Components/Settings/Settings.js` executes. The user can then upload an image and configure settings for zoom, magnify, map, or panorama via the editor panel.
* **Step 4:** After finishing the configuration, when the user clicks 'Publish', the settings data is saved to the database.
* **Step 5:** When a standard visitor views the website, the scripts from `src/Frontend/view.js` are loaded. The visitor can then interact with the features, like zooming in on mouse hover or dragging a panorama.
