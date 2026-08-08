<?php

if (! defined('ABSPATH')) {
  exit;
}

if( !class_exists( 'bpivbAdminMenu' ) ) {
	class bpivbAdminMenu {

    //constructor
		public function __construct() {
			add_action( 'admin_menu', [ $this, 'bpivb_AdminMenu_Create' ] );
		}


    //admin menu and submenu create function
    public function bpivb_AdminMenu_Create() {
          add_submenu_page(
            'edit.php?post_type=bpivb',
            __('Help - bPlugins', 'image-viewer'),
            __('Help And Demo', 'image-viewer'),
            'manage_options',
            'Image_viewer_block',
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
