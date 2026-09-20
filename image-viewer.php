<?php
/**
 * Plugin Name: All In One Image Viewer
 * Description: Turn an image into an interactive viewer: zoom, magnify, image map and 360° panorama rotation.
 * Version: 1.0.12
 * Requires at least: 6.5
 * Tested up to: 7.1
 * Requires PHP: 7.4
 * Author: bPlugins
 * Author URI: http://bplugins.com
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: image-viewer
 * @fs_premium_only /vendor/freemius
 * @fs_free_only /vendor/freemius-lite
 */

// ABS PATH
if (!defined('ABSPATH')) { exit; }


if ( function_exists( 'iv_fs' ) ) {
    iv_fs()->set_basename( true, __FILE__ );
} else {
    // Constant
    $bpivb_http_host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
    // Local hosts carry a port (Studio serves on localhost:PORT), so an exact
    // 'localhost' comparison never matched and asset versions stayed frozen.
    $bpivb_is_local = (bool) preg_match( '/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/', $bpivb_http_host );
    define( 'BPIVB_PLUGIN_VERSION', $bpivb_is_local ? time() : '1.0.12' );
    define('BPIVB_PLUGIN_PATH', plugin_dir_path(__FILE__));
    define('BPIVB_DIR', plugin_dir_url(__FILE__));
    define('BPIVB_ASSETS_DIR', plugin_dir_url(__FILE__) . 'assets/');

    if ( ! function_exists( 'iv_fs' ) ) {
        function iv_fs() {
            global $iv_fs;
            if ( ! isset( $iv_fs ) ) {
                // Freemius Lite only — opt-in telemetry, no paid plans or license layer.
                require_once BPIVB_PLUGIN_PATH . 'vendor/freemius-lite/start.php';

                $iv_fs_Config = [
                    '__FILE__'            => __FILE__,
                    'id'                  => '21722',
                    'slug'                => 'image-viewer',
                    'type'                => 'plugin',
                    'public_key'          => 'pk_7ca36303d5522e535067f3e4632f5',
                    'is_premium'          => false,
                    'has_premium_version' => true,
                    'has_addons'          => false,
                    'has_paid_plans'      => true,
                    'is_org_compliant'    => true,
                    'menu'                => array(
                        'slug'           => 'edit.php?post_type=bpivb',
                        'first-path'     => 'edit.php?post_type=bpivb&page=image_viewer_block#/welcome',
                        'contact'        => false,
                        'support'        => false,
                    ),
                ];

                $iv_fs = fs_lite_dynamic_init($iv_fs_Config);
            }
            return $iv_fs;
        }
        // Init Freemius Lite.
        iv_fs();
        do_action( 'iv_fs_loaded' );
    }

    // Main file logic
    require_once BPIVB_PLUGIN_PATH . 'includes/class-bpivbPlugin.php';

    // Ready-made sections for the inserter.
    require_once BPIVB_PLUGIN_PATH . 'includes/patterns.php';

    new bpivbPlugin();

}
