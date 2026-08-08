<?php
/**
 * Plugin Name: All In One Image Viewer
 * Description: Turn an image into an interactive viewer: zoom, magnify, image map and 360° panorama rotation.
 * Version: 1.0.9
 * Author: bPlugins
 * Author URI: http://bplugins.com
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: image-viewer
 */

// ABS PATH
if (!defined('ABSPATH')) {exit;}


if ( function_exists( 'iv_fs' ) ) {
    iv_fs()->set_basename( true, __FILE__ );
} else {
    // Constant
    $bpivb_http_host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
    define( 'BPIVB_PLUGIN_VERSION', 'localhost' === $bpivb_http_host ? time() : '1.0.9' );
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
                            'first-path'     => 'edit.php?post_type=bpivb&page=Image_viewer_block#/welcome',
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

        // ... Your plugin's main file logic ...
        require_once BPIVB_PLUGIN_PATH . 'includes/class-bpivbPlugin.php';

        new bpivbPlugin();

        // Wipe plugin data on uninstall, but only if the user opted in on the dashboard
        // Settings page. Registered through the SDK when it supports it; otherwise the
        // regular uninstall hook takes over.
        if ( function_exists( 'iv_fs' ) && method_exists( iv_fs(), 'add_action' ) ) {
            iv_fs()->add_action( 'after_uninstall', 'bpivb_uninstall_cleanup' );
        } else {
            register_uninstall_hook( __FILE__, 'bpivb_uninstall_cleanup' );
        }
}

/**
 * Uninstall cleanup. Must be a named function (not a closure) so it can be serialized.
 *
 * @return void
 */
function bpivb_uninstall_cleanup() {
	if ( ! get_option( 'bpivb_delete_data_on_uninstall' ) ) {
		return;
	}

	// Delete every saved Image Viewer and its revisions/meta.
	$bpivb_posts = get_posts( [
		'post_type'      => 'bpivb',
		'post_status'    => 'any',
		'numberposts'    => -1,
		'fields'         => 'ids',
		'suppress_filters' => true,
	] );

	foreach ( $bpivb_posts as $post_id ) {
		wp_delete_post( $post_id, true ); // Force delete (bypass trash).
	}

	delete_option( 'bpivb_delete_data_on_uninstall' );
}
