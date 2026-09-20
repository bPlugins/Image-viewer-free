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
            if ('bpivb_page_image_viewer_block' === $screen) {
                $dashboardAsset = $this->bpivb_AssetMeta('build/admin/dashboard.asset.php', ['react', 'react-dom', 'wp-components', 'wp-util']);

                wp_enqueue_style('bpivb-admin-dashboard-style', BPIVB_DIR . 'build/admin/dashboard.css', [], $dashboardAsset['version']);
                wp_enqueue_script('bpivb-admin-dashboard-script', BPIVB_DIR . 'build/admin/dashboard.js', $dashboardAsset['dependencies'], $dashboardAsset['version'], true);
            }

            //Load CSS/JS for post type list or edit page only when the post type matches 'bpivb'
            $current_screen = get_current_screen();
            if ($current_screen && 'bpivb' === $current_screen->post_type) {
                $postAsset = $this->bpivb_AssetMeta('build/admin-post.asset.php', ['wp-i18n']);

                wp_enqueue_style('bpivb-admin-post-style', BPIVB_DIR . 'build/admin-post.css', [], $postAsset['version']);
                wp_enqueue_script('bpivb-admin-post-script', BPIVB_DIR . 'build/admin-post.js', $postAsset['dependencies'], $postAsset['version'],  true);
            }
        }

        /**
         * Read a wp-scripts generated *.asset.php file so scripts are versioned by
         * build hash — the plugin version alone leaves stale bundles cached after a rebuild.
         * $extraDependencies covers handles used as globals (e.g. wp.ajax from wp-util),
         * which webpack cannot detect and so never lists in the asset file.
         */
        private function bpivb_AssetMeta($relativePath, $extraDependencies = [])
        {
            $assetFile = BPIVB_PLUGIN_PATH . $relativePath;
            $asset     = file_exists($assetFile) ? require $assetFile : [];

            $dependencies = isset($asset['dependencies']) ? $asset['dependencies'] : [];

            return [
                'dependencies' => array_values(array_unique(array_merge($dependencies, $extraDependencies))),
                'version'      => isset($asset['version']) ? $asset['version'] : BPIVB_PLUGIN_VERSION,
            ];
        }
    }
}
