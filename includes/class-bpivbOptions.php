<?php
/**
 * Plugin options for All In One Image Viewer.
 *
 * Currently holds the "delete data on uninstall" preference that the dashboard
 * Settings page toggles. The actual cleanup runs from bpivb_uninstall_cleanup()
 * in image-viewer.php.
 *
 * @package image-viewer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'bpivbOptions' ) ) {
	class bpivbOptions {

		/** Option holding the uninstall preference. */
		const DELETE_DATA_OPTION = 'bpivb_delete_data_on_uninstall';

		/** Nonce action guarding the AJAX save. */
		const NONCE_ACTION = 'bpivb_uninstall_nonce';

		public function __construct() {
			add_action( 'wp_ajax_bpivbSaveUninstallOption', [ $this, 'saveUninstallOption' ] );
		}

		/**
		 * Whether the user opted in to wiping plugin data on uninstall.
		 *
		 * @return bool
		 */
		public static function deleteDataOnUninstall() {
			return (bool) get_option( self::DELETE_DATA_OPTION, false );
		}

		/**
		 * Persists the "delete data on uninstall" toggle from the dashboard.
		 *
		 * @return void
		 */
		public function saveUninstallOption() {
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) ) {
				wp_send_json_error( __( 'Invalid security token.', 'image-viewer' ) );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( __( 'You do not have permission to perform this action.', 'image-viewer' ) );
			}

			$enabled = isset( $_POST['enabled'] ) && 'true' === sanitize_text_field( wp_unslash( $_POST['enabled'] ) );

			update_option( self::DELETE_DATA_OPTION, $enabled );

			wp_send_json_success( [
				'enabled' => $enabled,
				'message' => $enabled
					? __( 'All plugin data will be deleted when uninstalled.', 'image-viewer' )
					: __( 'Plugin data will be preserved when uninstalled.', 'image-viewer' ),
			] );
		}
	}

	new bpivbOptions();
}
