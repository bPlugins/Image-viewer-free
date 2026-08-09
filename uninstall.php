<?php
/**
 * Uninstall handler for All In One Image Viewer.
 *
 * Cleans up plugin data when the plugin is deleted from the admin.
 * Only runs if the user has opted in via the "Delete data on uninstall" setting.
 *
 * @package image-viewer
 */

// Exit if not called by WordPress.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

$bpivbDeleteData = (bool) get_option( 'bpivb_delete_data_on_uninstall', false );

if ( ! $bpivbDeleteData ) {
    return;
}

global $wpdb;

// 1. Delete all 'bpivb' custom post type posts and their meta/revisions efficiently.
$bpivb_post_ids = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type = %s", 'bpivb' ) );

if ( ! empty( $bpivb_post_ids ) ) {
    foreach ( $bpivb_post_ids as $post_id ) {
        wp_delete_post( $post_id, true ); // Force delete (bypass trash).
    }
}

// 2. Delete plugin options.
delete_option( 'bpivb_delete_data_on_uninstall' );