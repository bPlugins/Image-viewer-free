<?php
if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('bpivbPlugin')) {
    class bpivbPlugin
    {
        public function __construct()
        {
            add_action('plugins_loaded', [$this, 'bpivb_Load_Dependencies']);
            add_action('admin_enqueue_scripts', [$this, 'bpivb_AdminEnqueue_Scripts']);
        }
        public function bpivb_Load_Dependencies()
        {
            require_once BPIVB_PLUGIN_PATH . 'image-viewer-block.php';
            require_once BPIVB_PLUGIN_PATH . 'includes/class-shortCode.php';
            require_once BPIVB_PLUGIN_PATH . 'includes/class-bpivbOptions.php';
            require_once BPIVB_PLUGIN_PATH . 'includes/class-bpivbAdminMenu.php';
        }
        //admin aer Style and js file load
        public function bpivb_AdminEnqueue_Scripts($screen)
        {
            global $pagenow;
            //Load CSS/JS for my  plugin’s  only just condition diye load hosche akne bptb_page_b-pricing-table-block sudu load hosche
            if ('bpivb_page_Image_viewer_block' === $screen) {
                wp_enqueue_style('bpivb-admin-dashboard-style', BPIVB_DIR . 'build/admin/dashboard.css', [], BPIVB_PLUGIN_VERSION);
                wp_enqueue_script('bpivb-admin-dashboard-script', BPIVB_DIR . 'build/admin/dashboard.js', ['react', 'react-dom', "wp-components", "wp-util"], BPIVB_PLUGIN_VERSION, true);
            }

            //Load CSS/JS for post type list or edit page only when the post type matches 'bpivb'
            $current_screen = get_current_screen();
            if ($current_screen && 'bpivb' === $current_screen->post_type) {
                wp_enqueue_style('bpivb-admin-post-style', BPIVB_DIR . 'build/admin-post.css', [], BPIVB_PLUGIN_VERSION);
                wp_enqueue_script('bpivb-admin-post-script', BPIVB_DIR . 'build/admin-post.js', ['wp-i18n'], BPIVB_PLUGIN_VERSION,  true);
            }
        }
    }
}
