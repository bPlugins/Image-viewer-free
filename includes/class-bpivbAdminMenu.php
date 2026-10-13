<?php

if (! defined('ABSPATH')) {
  exit;
}

if( !class_exists( 'bpivbAdminMenu' ) ) {
	class bpivbAdminMenu {

    //constructor
		public function __construct() {
			add_action( 'admin_menu', [ $this, 'bpivb_AdminMenu_Create' ] );
			add_action( 'admin_head', [ $this, 'bpivb_highlightHelpDemoMenu' ] );
		}


		/**
		 * Color the "Help & Demos" submenu link so it stands out in the sidebar, the same
		 * treatment Image Gallery and Testimonials Block give theirs. One inline <style>
		 * since the sidebar persists across every admin screen.
		 */
		function bpivb_highlightHelpDemoMenu() { ?>
			<style>
				#adminmenu a[href*="page=image_viewer_block"],
				#adminmenu a[href*="page=image_viewer_block"] *,
				#adminmenu a[href*="page=image_viewer_block"]:hover,
				#adminmenu a[href*="page=image_viewer_block"]:hover *,
				#adminmenu a[href*="page=image_viewer_block"]:focus,
				#adminmenu a[href*="page=image_viewer_block"]:focus *,
				#adminmenu li.current a[href*="page=image_viewer_block"],
				#adminmenu li.current a[href*="page=image_viewer_block"] * {
					color: #f18500 !important;
				}
			</style>
		<?php }

    //admin menu and submenu create function
    public function bpivb_AdminMenu_Create() {
          add_submenu_page(
            'edit.php?post_type=bpivb',
            __('Help - bPlugins', 'image-viewer'),
            __('Help And Demo', 'image-viewer'),
            'manage_options',
            'image_viewer_block',
            [$this, 'renderDashboardPage']
          );
		}

    //dashboard page render
		public function renderDashboardPage(){?>
        <div id='bpivbDashboard' data-info='<?php echo esc_attr( wp_json_encode( [
                 'version'   => BPIVB_PLUGIN_VERSION,
                 'adminUrl'  => admin_url(),
                 'deleteDataOnUninstall' => bpivbOptions::deleteDataOnUninstall(),
                 'uninstallNonce' => wp_create_nonce( bpivbOptions::NONCE_ACTION ),
                  ] ) ); ?>' >
        </div>
		<?php
		}


  }
  new bpivbAdminMenu();
}
