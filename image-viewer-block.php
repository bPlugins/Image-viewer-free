<?php
if (! defined('ABSPATH')) {
    exit;
}
if (! class_exists('bpivbBlock')) {
    class bpivbBlock
    {
        public function __construct()
        {
            add_action('init', [$this, 'onInit']);
            add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
            add_action('enqueue_block_assets', [$this, 'pinBlockStyleVersions'], 5);
            add_action('enqueue_block_editor_assets', [$this, 'bpivbEnqueueBlockEditorAssets']);
            add_action('enqueue_block_assets', [$this, "bpivbFrontendScript"]);
            add_action('rest_api_init', function () {
                register_rest_route('bpivb/v1', '/image-proxy', [
                    'methods'  => 'GET',

                    //Permission check (prevents public abuse)
                    'permission_callback' => function () {
                        return current_user_can('upload_files');
                    },

                    //Strict URL validation before callback runs
                    'args' => [
                        'url' => [
                            'required' => true,
                            'sanitize_callback' => 'esc_url_raw',
                            'validate_callback' => function ($param) {

                                // Must be a valid URL
                                if (!wp_http_validate_url($param)) {
                                    return false;
                                }

                                // Allow only http / https
                                $scheme = wp_parse_url($param, PHP_URL_SCHEME);
                                if (!in_array($scheme, ['http', 'https'], true)) {
                                    return false;
                                }

                                return true;
                            },
                        ],
                    ],

                    'callback' => function ($data) {
                        $url = $data->get_param('url');

                        if (!$url) {
                            return new WP_Error('no_url', 'No URL provided', ['status' => 400]);
                        }

                        // Bypass transient cache for editors/admins to see instant updates
                        $bypass_cache = current_user_can('edit_posts');

                        // Generate unique cache key based on URL
                        $cache_key = 'bpivb_img_' . md5($url);
                        $cached_data = $bypass_cache ? false : get_transient($cache_key);

                        if (false !== $cached_data) {
                            $body = $cached_data['body'];
                            $clean_type = $cached_data['type'];
                        } else {
                            $response = wp_safe_remote_get($url);

                            if (is_wp_error($response)) {
                                return new WP_Error('fetch_failed', 'Failed to fetch image', ['status' => 500]);
                            }
                        // !update
                        // $body = wp_remote_retrieve_body($response);
                        // $type = wp_remote_retrieve_header($response, 'content-type');

                            $body = wp_remote_retrieve_body($response);
                            $type = wp_remote_retrieve_header($response, 'content-type');
                            
                            // Safe Image Mime Types Whitelist
                            $allowed_mime_types = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp' ];
                            $clean_type = '';
                            foreach ( $allowed_mime_types as $mime ) {
                                if ( strpos( strtolower( $type ), $mime ) !== false ) {
                                    $clean_type = $mime;
                                    break;
                                }
                            }
                            if ( empty( $clean_type ) ) {
                                return new WP_Error('invalid_mime', 'The requested file is not a valid image format.', ['status' => 400]);
                            }

                            // Cache the safe image data for 12 hours
                            set_transient($cache_key, [
                                'body' => $body,
                                'type' => $clean_type
                            ], 12 * HOUR_IN_SECONDS);
                        }

                        //?method 2 rest_pre_serve_request filter use kore response send korteci
                        // Use $clean_type instead of raw $type in headers
                        add_filter('rest_pre_serve_request', function ($served, $result, $request, $server) use ($body, $clean_type) {

                            // WordPress way to send headers (no direct header())
                            $server->send_headers([
                                'Content-Type'              => $clean_type, // Safely use the whitelisted MIME type
                                'Cache-Control'             => 'max-age=3600',
                                'Content-Length'            => strlen($body),
                                'X-Content-Type-Options'    => 'nosniff',
                            ]);

                            echo $body; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                            return true;
                        }, 10, 4);


                        return new WP_REST_Response(null, 200);


                       //?method 3 WP_REST_Response use kore response send korteci but without JSON encoding, direct binary data output korteci
                        // $http_code = wp_remote_retrieve_response_code($response);
                        // Return raw binary response
                        // $rest_response = new WP_REST_Response(null, $http_code);
                        // $rest_response->set_headers([
                        //     'Content-Type' => $type,
                        //     'Content-Length' => strlen($body),
                        //     'Cache-Control' => 'max-age=3600',
                        // ]);

                        // // Use filter to output binary data without JSON encoding
                        // add_filter('rest_pre_serve_request', function ($served, $status, $response) use ($body) {
                        //     if (!empty($body)) {
                        //         echo $body;
                        //         return true;
                        //     }
                        //     return $served;
                        // }, 10, 3);

                        // return $rest_response;
                    },

                ]);
            });

        }

        public function enqueueBlockAssets()
        {
            wp_register_style('bpivb-magnify', BPIVB_ASSETS_DIR . 'css/magnify.css', [], BPIVB_PLUGIN_VERSION);
            wp_register_script('bpivb-panzoom', BPIVB_ASSETS_DIR . 'js/panzoom.min.js', ['jquery'], BPIVB_PLUGIN_VERSION, true);
            wp_register_script('bpivb-magnify', BPIVB_ASSETS_DIR . 'js/magnify.js', ['jquery'], BPIVB_PLUGIN_VERSION, true);
            wp_register_script('bpivb-three', BPIVB_ASSETS_DIR . 'js/three.min.js', [], BPIVB_PLUGIN_VERSION, true);
            wp_register_script('bpivb-panoramajs', BPIVB_ASSETS_DIR . 'js/panorama.min.js', ["bpivb-three", "jquery"], BPIVB_PLUGIN_VERSION, true);
        }

        // bpivb-image-viewer-directory ta block.json aer name
        public function bpivbEnqueueBlockEditorAssets()
        {
            $editor_script_data = 'var BPIVB_REST = ' . wp_json_encode([
                'root'  => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
            ]) . ';';

            // Prefer the in-dashboard pricing route. It lives on a submenu page registered
            // with 'manage_options' (see bpivbAdminMenu), so users without that capability
            // cannot open it — they get the public product pricing page instead.
            $editor_script_data .= 'var BPIVB_PRICING = ' . wp_json_encode([
                'dashboard' => current_user_can('manage_options')
                    ? admin_url('edit.php?post_type=bpivb&page=Image_viewer_block#/pricing')
                    : '',
                'external'  => 'https://bplugins.com/products/image-viewer/pricing',
            ]) . ';';

            wp_add_inline_script('bpivb-image-viewer-directory-editor-script', $editor_script_data, 'before');

            wp_enqueue_style(
                'bpivb-image-viewer-directory-editor-css',
                BPIVB_DIR . 'build/index.css',
                [],
                BPIVB_PLUGIN_VERSION
            );
        }

        public function bpivbFrontendScript()
        {
            $view_script_data = 'var BPIVB_REST = ' . wp_json_encode([
                'root'  => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
            ]) . ';';

            wp_add_inline_script('bpivb-image-viewer-directory-view-script', $view_script_data, 'before');
        }

        public function onInit()
        {
            register_block_type(__DIR__ . '/build');
        }

        /**
         * Version the block's stylesheets against the build.
         *
         * block.json declares no "version", so WordPress versions the block's styles
         * with the WordPress version — static across rebuilds. index.js busts from the
         * content hash in index.asset.php, so the editor could run new markup against
         * a stale cached stylesheet.
         *
         * @return void
         */
        public function pinBlockStyleVersions()
        {
            $handles = ['bpivb-image-viewer-directory-editor-style', 'bpivb-image-viewer-directory-style'];
            $styles  = wp_styles();

            foreach ($handles as $handle) {
                if (isset($styles->registered[$handle])) {
                    $styles->registered[$handle]->ver = BPIVB_PLUGIN_VERSION;
                }
            }
        }
    }

    new bpivbBlock();
}
