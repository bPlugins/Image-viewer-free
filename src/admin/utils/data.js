const slug = 'image-viewer';

import bannerSVG from '../assets/banner.svg';

// ─── Identity & shared props ──────────────────────────────────────────────────
export const dashboardInfo = (info) => {
  const { version, adminUrl = '', deleteDataOnUninstall = false, uninstallNonce = '' } = info;

  return {
    slug,
    version,
    adminUrl,
    displayOurPlugins: true,
    deleteDataOnUninstall,
    uninstallNonce,
    name: 'All In One Image Viewer',
    displayName: 'All In One Image Viewer - Interactive Image Viewer Block',
    description:
      "All In One Image Viewer is a WordPress Gutenberg block that lets you add interactive images with zoom, pan, image map, 360° panorama rotation, and magnify options.",
    media: {
      logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
      banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
      thumbnail: bannerSVG,
      proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
      isYoutube: false,
    },
    pages: {
      org: `https://wordpress.org/plugins/${slug}/`,
      landing: `https://bplugins.com/products/${slug}/`, // Learn More button
      docs: `https://bplugins.com/docs/${slug}/`,
      pricing: `https://bplugins.com/products/${slug}/pricing`, // Buy Now button
    },
    freemius: {
      product_id: 21722,
      plan_id: 36243,
      public_key: "pk_7ca36303d5522e535067f3e4632f5",
    },
    startButton: {
      label: "Start Now",
      url: `${adminUrl}post-new.php?post_type=bpivb`,
    },
  };
};

// ─── Welcome page content ─────────────────────────────────────────────────────
export const welcomeInfo = adminUrl => ({
  keywords: ['Zoom', 'Magnify', 'Interactive Map', 'Pano or Rotation'],
  keywordsLabel: 'Interactive Modes',
  gettingStarted: {
    tabs: [
      {
        key: 'gutenberg',
        label: 'Gutenberg',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
        steps: [
          {
            num: 1,
            title: 'Insert the Block',
            body: 'Click <strong>+</strong> in the editor and search for <strong>Image Viewer</strong> block.',
            link: { url: `${adminUrl}post-new.php?post_type=page`, label: 'Add New Page' },
          },
          {
            num: 2,
            title: 'Select Image',
            body: 'Upload or choose an image from your Media Library.',
          },
          {
            num: 3,
            title: 'Configure Viewer',
            body: 'Choose the viewer type (Zoom, Magnify, Map, Pano or Rotation) and customize settings in the sidebar panel.',
          },
          {
            num: 4,
            title: 'Publish Page',
            body: 'Publish or update the page to see the interactive viewer live!',
          },
        ],
      },
      {
        key: 'shortcode',
        label: 'ShortCode',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
        steps: [
          {
            num: 1,
            title: 'Create Viewer Post',
            body: 'Go to <strong>All In One Image Viewer › Add New</strong> in your admin menu.',
            link: { url: `${adminUrl}post-new.php?post_type=bpivb`, label: 'Create New' },
          },
          {
            num: 2,
            title: 'Build & Configure',
            body: 'Select your image and customize options in the Gutenberg block editor.',
          },
          {
            num: 3,
            title: 'Copy Shortcode',
            body: 'Publish the post and copy the generated shortcode (e.g. <code>[bpivb id=123]</code>) from the list table.',
            link: { url: `${adminUrl}edit.php?post_type=bpivb`, label: 'All Image Viewers' },
          },
          {
            num: 4,
            title: 'Paste Anywhere',
            body: 'Paste the shortcode into any post, page, widget, or page builder text element!',
          },
        ],
      },
      {
        key: 'elementor',
        label: 'Elementor',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="8" y1="8" x2="8" y2="16" />
            <line x1="12" y1="8" x2="16" y2="8" />
            <line x1="12" y1="12" x2="16" y2="12" />
            <line x1="12" y1="16" x2="16" y2="16" />
          </svg>
        ),
        steps: [
          {
            num: 1,
            title: 'Create Viewer Post',
            body: 'Go to <strong>All In One Image Viewer › Add New</strong>, configure your viewer, publish it, then copy its shortcode.',
            link: { url: `${adminUrl}post-new.php?post_type=bpivb`, label: 'Create New' },
          },
          {
            num: 2,
            title: 'Edit with Elementor',
            body: 'Open any post or page in the <strong>Elementor</strong> editor.',
          },
          {
            num: 3,
            title: 'Add Shortcode Widget',
            body: 'Search for the <strong>Shortcode</strong> widget in the Elementor elements panel and drag it into your layout.',
          },
          {
            num: 4,
            title: 'Paste Shortcode',
            body: 'Paste your viewer shortcode (e.g. <code>[bpivb id=123]</code>) into the widget input field and save your changes.',
          },
        ],
      },
      {
        key: 'php',
        label: 'PHP',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 13 7 15 9 17" />
            <polyline points="15 13 17 15 15 17" />
          </svg>
        ),
        steps: [
          {
            num: 1,
            title: 'Get the Viewer ID',
            body: 'Go to <strong>All In One Image Viewer › All Image Viewer</strong> and note the <strong>ID</strong> of the viewer you want to embed.',
            link: { url: `${adminUrl}edit.php?post_type=bpivb`, label: 'All Image Viewers' },
          },
          {
            num: 2,
            title: 'Copy PHP Function',
            body: 'Copy the WordPress <code>do_shortcode</code> call: <pre><code>&lt;?php echo do_shortcode(\'[bpivb id=YOUR_ID]\'); ?&gt;</code></pre>',
          },
          {
            num: 3,
            title: 'Insert in Template',
            body: 'Open your theme or template file (e.g. <code>single.php</code>, <code>page.php</code>) in an editor.',
          },
          {
            num: 4,
            title: 'Replace ID & Save',
            body: 'Paste the code where the viewer should appear and replace <code>YOUR_ID</code> with your actual viewer ID.',
          },
        ],
      },
    ],
  },
  changelogs: [
    {
      type: 'update',
      version: '1.0.10 – 9 August 2026',
      list: [
        'Fixed: Block styles could load from cache after an update — stylesheets now version with the build.',
        'Fixed: Theme switcher alignment inside the block toolbar.',
        'Improved: Plugin data cleanup on delete now runs through a dedicated uninstall handler.',
        'Improved: Shortcodes now preview unpublished viewers for editors, and the list table flags a shortcode that is not live yet.',
        'Improved: Clearer shortcode messages for a missing or wrong ID, shown to editors only.',
      ],
    },
    {
      type: 'new',
      version: '1.0.9 – 4 July 2026',
      list: [
        'Admin Dashboard: Banner Update.',
        'New Theme: Interactive Image Accordion',
        'Improved: Freemius Pro Detection'
      ],
    },
    {
      type: 'update',
      version: '1.0.8 – 11 June 2026',
      list: [
        'Fixed XSS security vulnerability.',
        'Improved i18n translations and labels.',
        'Resolved namespace conflicts.',
        'Code cleanup and performance improvements.',
        'Fixed caching-related performance issues.',
        'Admin dashboard improvements.',
      ],
    },
    {
      type: 'update',
      version: '1.0.7 – 4 June 2026',
      list: [
        'Updated API version for improved performance and compatibility.',
        'Improved notice modal UI with a new modern design style.',
        'Fixed naming consistency issues across the plugin for improved clarity and uniform structure.',
      ],
    },
    {
      type: 'update',
      version: '1.0.6 – 18 May 2026',
      list: ['Updated shortcode UI for better usability', 'Removed block preview and added Theme Switcher', 'Improved Pro Modal UI design and interaction'],
    },
    {
      type: 'new',
      version: '1.0.5 – 4 March 2026',
      list: [' Added hotspot annotation size and text elements.'],
    },
    {
      type: 'update',
      version: '1.0.4 – 23 February 2026',
      list: [' Fixed the scroll wheel issue.', ' Fixed the image cropping issue.', ' Duplicate styles of hotspot annotation styles have been removed.'],
    },
    {
      type: 'new',
      version: '1.0.3 - 29 January, 2026',
      list: [' Added New Eight Style', ' Added ShortCode and Admin Dashboard.'],
    },
    {
      type: 'new',
      version: '1.0.2 - 17 April, 2025',
      list: [' Added default image.'],
    },
    {
      type: 'update',
      version: '1.0.1 - 29 June 2024',
      list: ['Changed plugin display name, block name, updated banner, and updated feature map.'],
    },
    {
      type: 'new',
      version: '1.0.0',
      list: [' Initial Release'],
    },
  ],
  proFeatures: [
    '9 Premium Viewer Styles for modern and visual image presentation.',
    'Custom Styling for borders, shadows, padding, and positioning.',
    'Advanced Typography Controls for titles, labels, and captions.',
    'Zoom Pan Viewer with touch gestures and drag interaction.',
    'Image Transformation including rotation, flipping, brightness, and contrast.',
    'Creative Image Masking with custom shapes and positioning.',
    'Interactive Comparison Slider with before/after labels and icons.',
    'Device-based Viewport Control for screen-specific dimensions.',
    'Multi Image Overlay with layering, opacity, and visibility toggles.',
    'Interactive Hotspot Annotations with tooltips and URL linking.',
    'Custom Aspect Ratios and Object-Fit modes for perfect proportions.',
  ],
});

// ─── Demos page ───────────────────────────────────────────────────────────────
export const demoInfo = {
  allInOneLabel: 'See All Demos',
  allInOneLink: 'https://bblockswp.com/demo/image-map-block-all-demos/',
  demos: [
    {
      icon: '',
      title: 'All In One Image Viewer- Zoom',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewer-block-zoom/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Magnify',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewer-magnify/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Map',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-map/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Pano Or Rotation',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewer-pano-or-rotation/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer-  Interactive Image Accordion',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewer-interactive-image-accordion/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Transform Image',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-transform/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Masking',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-masking/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Image Comparison Slider',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-comparison-slider/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Image Viewport',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-image-viewport/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Multi Image Overlay',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-multi-image-overlay/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Hotspot Annotations',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-hotspot-annotation/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Zoom & Pan Viewer',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-zoom-pan-viewer/',
    },
    {
      icon: '',
      title: 'All In One Image Viewer- Image Aspect Ratio',
      type: 'iframe',
      url: 'https://bblockswp.com/demo/all-in-one-image-viewers-blocks-image-aspect-ratio/',
    },
  ],
};

// ─── Pricing page ─────────────────────────────────────────────────────────────
export const pricingInfo = {
  logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
  pluginId: 21722,
  planId: 36243,
  licenses: [
    1,
    3,
    null
  ],
  button: {
    label: 'Buy Now ➜'
  },
  featured: {
    selected: 3,
  }
};

// ─── Settings page ────────────────────────────────────────────────────────────
export const settingsInfo = {
  ajaxAction: 'bpivbSaveUninstallOption',
  cleanupItems: [
    'All saved Image Viewers (bpivb post type) and their revisions',
    'Plugin settings and options',
  ],
};
