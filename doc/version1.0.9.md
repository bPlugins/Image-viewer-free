## What's New in Version 1.0.9
* **New Theme:** Added a premium "Interactive Image Accordion" theme for displaying multiple images in a sleek accordion layout.
  
  ![Interactive Image Accordion Preview](https://i.ibb.co/MD4C9zRQ/interactive-image.png)

* **Pro Detection Improvement:** Strengthened Freemius Pro integration by moving from directory-name-based detection to a reliable file-existence check (`vendor/freemius/start.php`), making the plugin structure more robust against accidental folder renames.

```
Old: define('BPIVB_HAS_PRO', (plugin_basename(__FILE__) === 'image-viewer-pro/image-viewer.php'));
New: define( 'BPIVB_HAS_PRO', file_exists( dirname(__FILE__) . '/vendor/freemius/start.php' ) );
```

* **Best Practices & Security:** Replaced the deprecated `wp_localize_script()` with the standard `wp_add_inline_script()` for passing JavaScript data to both the editor and frontend scripts, fixing WordPress Plugin Check warnings.

```
Old: wp_localize_script(...)
New: wp_add_inline_script(...)
```
I've already pushed the code to GitHub.
---

