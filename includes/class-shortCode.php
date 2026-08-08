<?php

if ( !defined( 'ABSPATH' ) ) { exit; }

if ( !class_exists( 'bpivbShortcode' ) ) {
	class bpivbShortcode {
			private $post_type = 'bpivb';
			public function __construct() {
				add_action( 'init', [$this, 'bpivb_Register_PostType']);
				add_filter( 'manage_bpivb_posts_columns', [$this, 'manage_bpivb_postsColumns'], 10 );
				add_action( 'manage_bpivb_posts_custom_column', [$this, 'manage_bpivb_postsCustomColumns'], 10, 2 );
				add_shortcode( 'bpivb', [$this, 'bpivb_onAddShortcode'] ); //image-viewer aey text ta  manage_bpivb_postsCustomColumns aer input fild aer sate mil rakte hobe
		}

		public function bpivb_Register_PostType(){

			$icon = '<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 16 16">
							<g color="#000000" fill="gray">
								<path d="M11.5 3c-.696 0-1.276.476-1.445 1.12 1 .18 1.919.61 2.683 1.226A1.5 1.5 0 0 0 11.5 3z" overflow="visible"/>
								<path d="M1 1v14h4.738a6.04 6.04 0 0 1-2.365-3H2V2h12v4.738c.618.94.98 2.061.98 3.262.02 0 .02-1.254.02-9zm5.793 11c.543.6 1.322.98 2.207.98.885 0 1.664-.38 2.207-.98z" overflow="visible"/>
								<path d="M8.799 7.04a3.003 3.003 0 0 0-.758.148L7.5 8l-.248-.414A2.956 2.956 0 0 0 6.02 10a3 3 0 0 0 .181 1H11zm-5.713 3.802L3 11h.111a5.913 5.913 0 0 1-.025-.158z" overflow="visible"/>
								<path d="M9 5c-2.755 0-5 2.245-5 5s2.245 5 5 5 5-2.245 5-5-2.245-5-5-5zm0 1.04A3.954 3.954 0 0 1 12.96 10 3.954 3.954 0 0 1 9 13.96 3.954 3.954 0 0 1 5.04 10 3.954 3.954 0 0 1 9 6.04z" fontWeight="400" overflow="visible"/>
								<path d="M12.354 12.646l-.708.708 2.5 2.5.708-.708z" fillRule="evenodd"/>
							</g>
      </svg>';

			// Register Post Type
			register_post_type( 'bpivb', [
				  'labels'				      => [
					'name'		          => __( 'All In One Image Viewer', 'image-viewer' ),
					'singular_name'    	=> __( 'All In One Image Viewer', 'image-viewer' ),
					'add_new'		        => __( 'Add New ', 'image-viewer' ),
					'add_new_item'	    => __( 'Add New Image viewer', 'image-viewer' ),
					'edit_item'		      => __( 'Edit Image viewer', 'image-viewer' ),
					'new_item'		      => __( 'New Image viewer', 'image-viewer' ),
					'all_items'          => __('All Image Viewer', 'image-viewer'),
					'view_item'		      => __( 'View Image viewer', 'image-viewer' ),
					'search_items'	    => __( 'Search Image viewer', 'image-viewer' ),
					'not_found'		      => __( 'Sorry, we couldn\'t find the Image viewers you are looking for.', 'image-viewer' )
				],
				'public'				      => false,
				'show_ui'				      => true, 
				'show_in_rest'			  => true,
				'publicly_queryable'	=> false,
        'show_in_menu'        => true,
				'exclude_from_search'	=> true,
				'menu_position'			  => 20,
				'has_archive'			    => false,
				'menu_icon'           => 'data:image/svg+xml;base64,' . base64_encode($icon),
				'hierarchical'			  => false,
				'capability_type'		  => 'page',
				'rewrite'				      => [ 'slug' => 'bpivb' ],
				'supports'				    => [ 'title', 'editor' ],
				'template'            => [ [ 'bpivb/image-viewer-directory' ] ],
				'template_lock'			  => 'all',
			] );
		}

		//*shortcode list create this function.
		public function manage_bpivb_postsColumns( $defaults ) {
			unset( $defaults['date'] );
			$defaults['shortcode'] = __('Shortcode', 'image-viewer');
			$defaults['date']      = __('Date', 'image-viewer');
			return $defaults;
		}

		//*Adjusted with post.js  //And the short code copies it with this function.
		public function manage_bpivb_postsCustomColumns( $column_name, $post_ID ) {
			if ( $column_name == 'shortcode' ) {
				echo '<div class="bpivbAdminShortcode" id="bpivbAdminShortcode-' . esc_attr( $post_ID ) . '">
					<input value="[bpivb id=' . esc_attr( $post_ID ) . ']" onclick="copybpivbAdminShortcode(\'' . esc_attr( $post_ID ) . '\')">
					<span class="tooltip">' . esc_html__( 'Copy To Clipboard', 'image-viewer' ) . '</span>
				</div>';
			}
		}

		//*Shortcode render function
		// public function bpivb_onAddShortcode($atts) {
		// 		if (isset($atts['id'])){
		// 					$post = get_post($atts['id']);
		// 					if ($post) {
		// 							$blocks = parse_blocks($post->post_content);
		// 							foreach ($blocks as $block) {
		// 									if ($block['blockName'] === 'bpivb/image-viewer-directory') {
		// 										return render_block( $block );
		// 									}
		// 							}
		// 					} else {
		// 						return 'Post not found or invalid post type.';
		// 					}
		// 		}
		// }
		public function bpivb_onAddShortcode($atts)
		{
			if (is_array($atts) && isset($atts['id'])) {
				$post = get_post(intval($atts['id']));
				if ($post && 'bpivb' === $post->post_type && 'publish' === $post->post_status) {
					$blocks = parse_blocks($post->post_content);
					foreach ($blocks as $block) {
						if ($block['blockName'] === 'bpivb/image-viewer-directory') {
							return render_block($block);
						}
					}
				} else {
					return esc_html__('Post not found or invalid post type.', 'image-viewer');
				}
			}
		}
	}
  new bpivbShortcode();
}
