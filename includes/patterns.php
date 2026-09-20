<?php
/**
 * Bundled block patterns.
 *
 * The block does four quite different things — zoom, magnify, image map and
 * 360° rotation — and arrives from the inserter set to whichever one is the
 * default, on a stock photograph. Most people never find the other three.
 * There is one pattern per viewer type, so all four are discoverable by
 * inserting a section rather than by reading the settings panel.
 *
 * The placeholder images are drawn inline. That is not only about avoiding a
 * network request: an SVG stays sharp at any magnification, which is exactly
 * what the zoom and magnify viewers are for, and the floor plan below needs
 * known geometry for its hotspots to land on anything.
 *
 * @package image-viewer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wrap SVG markup as a data URI.
 *
 * @param string $svg Percent-encoded SVG body.
 * @return string
 */
function bpivb_pattern_svg( $svg ) {
	return 'data:image/svg+xml;charset=utf-8,' . $svg;
}

/**
 * A detailed illustration that rewards magnification: a stylised chart with
 * fine rules, small type and a plotted line.
 *
 * @return string Data URI.
 */
function bpivb_pattern_detail_image() {
	$rules = '';
	for ( $i = 1; $i < 24; $i++ ) {
		$x      = 60 + ( $i * 48 );
		$rules .= '%3Cline x1=\'' . $x . '\' y1=\'70\' x2=\'' . $x . '\' y2=\'700\' stroke=\'%23c9d4dd\' stroke-width=\'1\'/%3E';
	}
	for ( $i = 1; $i < 13; $i++ ) {
		$y      = 70 + ( $i * 52 );
		$rules .= '%3Cline x1=\'60\' y1=\'' . $y . '\' x2=\'1200\' y2=\'' . $y . '\' stroke=\'%23c9d4dd\' stroke-width=\'1\'/%3E';
	}

	return bpivb_pattern_svg(
		'%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1280\' height=\'760\'%3E'
		. '%3Crect width=\'1280\' height=\'760\' fill=\'%23f6f8fa\'/%3E'
		. $rules
		. '%3Cpolyline points=\'60,600 204,540 348,566 492,430 636,470 780,320 924,360 1068,210 1200,250\' fill=\'none\' stroke=\'%230f766e\' stroke-width=\'6\' stroke-linejoin=\'round\'/%3E'
		. '%3Ccircle cx=\'780\' cy=\'320\' r=\'11\' fill=\'%239a3412\'/%3E'
		. '%3Ccircle cx=\'1068\' cy=\'210\' r=\'11\' fill=\'%239a3412\'/%3E'
		. '%3Ctext x=\'60\' y=\'46\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'26\' font-weight=\'700\' fill=\'%2316181a\'%3ESurvey readings 2019-2026%3C/text%3E'
		. '%3Ctext x=\'60\' y=\'736\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'13\' fill=\'%234a4f52\'%3EPlate 4 - zoom in to read the marked points%3C/text%3E'
		. '%3C/svg%3E'
	);
}

/**
 * A simple floor plan, 1200x700, with rooms in known positions so the hotspots
 * below have something to sit on.
 *
 * @return string Data URI.
 */
function bpivb_pattern_floor_plan() {
	return bpivb_pattern_svg(
		'%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'700\'%3E'
		. '%3Crect width=\'1200\' height=\'700\' fill=\'%23f4f1ea\'/%3E'
		. '%3Crect x=\'40\' y=\'40\' width=\'1120\' height=\'620\' fill=\'%23ffffff\' stroke=\'%2316181a\' stroke-width=\'6\'/%3E'
		. '%3Cline x1=\'440\' y1=\'40\' x2=\'440\' y2=\'400\' stroke=\'%2316181a\' stroke-width=\'5\'/%3E'
		. '%3Cline x1=\'40\' y1=\'400\' x2=\'1160\' y2=\'400\' stroke=\'%2316181a\' stroke-width=\'5\'/%3E'
		. '%3Cline x1=\'800\' y1=\'400\' x2=\'800\' y2=\'660\' stroke=\'%2316181a\' stroke-width=\'5\'/%3E'
		. '%3Ctext x=\'150\' y=\'230\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'26\' fill=\'%234a4f52\'%3EStudio%3C/text%3E'
		. '%3Ctext x=\'700\' y=\'230\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'26\' fill=\'%234a4f52\'%3EWorkshop%3C/text%3E'
		. '%3Ctext x=\'330\' y=\'545\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'26\' fill=\'%234a4f52\'%3EGallery%3C/text%3E'
		. '%3Ctext x=\'930\' y=\'545\' font-family=\'Helvetica,Arial,sans-serif\' font-size=\'26\' fill=\'%234a4f52\'%3ECafé%3C/text%3E'
		. '%3C/svg%3E'
	);
}

/**
 * A 2:1 strip that wraps horizontally, so the 360° viewer has something whose
 * left and right edges meet.
 *
 * @return string Data URI.
 */
function bpivb_pattern_panorama() {
	/*
	 * An equirectangular strip: the horizon falls on the vertical middle, so
	 * the ridge has to straddle y=512 or a visitor at eye level sees nothing
	 * but sky. Both ridges are sampled every 128px and their first and last
	 * heights are equal, so the strip wraps without a seam.
	 */
	$far_heights  = array( 520, 480, 500, 440, 465, 505, 430, 455, 490, 435, 470, 510, 460, 480, 445, 500, 520 );
	$near_heights = array( 585, 500, 470, 530, 425, 480, 545, 450, 405, 470, 525, 490, 440, 510, 540, 495, 585 );

	$ridge = function ( $heights, $fill ) {
		$points = array();
		foreach ( $heights as $i => $y ) {
			$points[] = ( $i * 128 ) . ',' . $y;
		}
		// Close the shape down the sides and along the bottom edge.
		$points[] = '2048,1024';
		$points[] = '0,1024';

		return '%3Cpolygon points=\'' . implode( ' ', $points ) . '\' fill=\'' . rawurlencode( $fill ) . '\'/%3E';
	};

	return bpivb_pattern_svg(
		'%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'2048\' height=\'1024\'%3E'
		. '%3Cdefs%3E%3ClinearGradient id=\'sky\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E'
		. '%3Cstop offset=\'0\' stop-color=\'%234f93c4\'/%3E'
		. '%3Cstop offset=\'1\' stop-color=\'%23d3e7f2\'/%3E'
		. '%3C/linearGradient%3E%3C/defs%3E'
		. '%3Crect width=\'2048\' height=\'1024\' fill=\'url(%23sky)\'/%3E'
		. '%3Ccircle cx=\'1536\' cy=\'250\' r=\'70\' fill=\'%23fff6d8\'/%3E'
		. $ridge( $far_heights, '#7fa189' )
		. $ridge( $near_heights, '#2f5741' )
		. '%3C/svg%3E'
	);
}

/**
 * One image-map hotspot.
 *
 * Coordinates are pixels measured inside the image container, not percentages,
 * so these are placed for the height each pattern sets and are meant to be
 * nudged once a real image is in.
 *
 * @param int    $left   Left offset in pixels.
 * @param int    $top    Top offset in pixels.
 * @param int    $width  Width in pixels.
 * @param int    $height Height in pixels.
 * @param string $title  Tooltip title.
 * @param string $link   Destination.
 * @return array
 */
function bpivb_pattern_hotspot( $left, $top, $width, $height, $title, $link = '#' ) {
	return array(
		'mapColor'  => '#0f766e40',
		'mapBorder' => array(
			'color' => '#0f766ecc',
			'width' => '2px',
			'style' => 'solid',
		),
		'mapShow'   => true,
		'top'       => $top,
		'left'      => $left,
		'width'     => $width,
		'height'    => $height,
		'shape'     => 'rect',
		'link'      => $link,
		'title'     => $title,
		'target'    => '_self',
	);
}

/**
 * Serialise the viewer block into block markup.
 *
 * The block renders from render.php and saves nothing between its delimiters.
 *
 * @param array $attrs Block attributes.
 * @return string
 */
function bpivb_pattern_block( $attrs ) {
	return '<!-- wp:bpivb/image-viewer-directory ' . wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ' /-->';
}

/**
 * A core heading.
 *
 * @param string $text   Heading text.
 * @param int    $level  Heading level.
 * @param bool   $center Centre it.
 * @return string
 */
function bpivb_pattern_heading( $text, $level = 2, $center = true ) {
	$level = (int) $level;

	if ( ! $center ) {
		return '<!-- wp:heading {"level":' . $level . '} -->'
			. '<h' . $level . ' class="wp-block-heading">' . esc_html( $text ) . '</h' . $level . '>'
			. '<!-- /wp:heading -->';
	}

	return '<!-- wp:heading {"textAlign":"center","level":' . $level . '} -->'
		. '<h' . $level . ' class="wp-block-heading has-text-align-center">' . esc_html( $text ) . '</h' . $level . '>'
		. '<!-- /wp:heading -->';
}

/**
 * A core paragraph.
 *
 * @param string $text   Paragraph text.
 * @param bool   $center Centre it.
 * @return string
 */
function bpivb_pattern_paragraph( $text, $center = true ) {
	if ( ! $center ) {
		return '<!-- wp:paragraph --><p>' . esc_html( $text ) . '</p><!-- /wp:paragraph -->';
	}

	return '<!-- wp:paragraph {"align":"center"} -->'
		. '<p class="has-text-align-center">' . esc_html( $text ) . '</p>'
		. '<!-- /wp:paragraph -->';
}

/**
 * A vertical spacer.
 *
 * @param int $px Height in pixels.
 * @return string
 */
function bpivb_pattern_spacer( $px = 24 ) {
	$px = (int) $px;

	return '<!-- wp:spacer {"height":"' . $px . 'px"} -->'
		. '<div style="height:' . $px . 'px" aria-hidden="true" class="wp-block-spacer"></div>'
		. '<!-- /wp:spacer -->';
}

/**
 * Wrap blocks in a group.
 *
 * @param string $inner Inner block markup.
 * @param string $align full, wide or empty.
 * @return string
 */
function bpivb_pattern_group( $inner, $align = '' ) {
	$attrs   = $align ? '{"align":"' . $align . '","layout":{"type":"constrained"}}' : '{"layout":{"type":"constrained"}}';
	$classes = $align ? 'wp-block-group align' . $align : 'wp-block-group';

	return '<!-- wp:group ' . $attrs . ' -->'
		. '<div class="' . esc_attr( $classes ) . '">' . $inner . '</div>'
		. '<!-- /wp:group -->';
}

/**
 * Two columns.
 *
 * @param string $left  Left column markup.
 * @param string $right Right column markup.
 * @return string
 */
function bpivb_pattern_columns( $left, $right ) {
	return '<!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->'
		. '<div class="wp-block-columns alignwide are-vertically-aligned-center">'
		. '<!-- wp:column {"verticalAlignment":"center","width":"60%"} -->'
		. '<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:60%">' . $left . '</div>'
		. '<!-- /wp:column -->'
		. '<!-- wp:column {"verticalAlignment":"center","width":"40%"} -->'
		. '<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:40%">' . $right . '</div>'
		. '<!-- /wp:column -->'
		. '</div><!-- /wp:columns -->';
}

/**
 * Register the pattern category and the patterns themselves.
 *
 * @return void
 */
function bpivb_register_patterns() {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}

	$category = 'image-viewer';

	register_block_pattern_category(
		$category,
		array( 'label' => __( 'Image Viewers', 'image-viewer' ) )
	);

	$detail  = bpivb_pattern_detail_image();
	$plan    = bpivb_pattern_floor_plan();
	$pano    = bpivb_pattern_panorama();

	$patterns = array();

	/* Zoom ---------------------------------------------------------------- */
	$patterns['product-zoom'] = array(
		'title'       => __( 'Product detail with zoom', 'image-viewer' ),
		'description' => __( 'A zoomable image beside its description, for a product page or a plate that rewards a closer look.', 'image-viewer' ),
		'keywords'    => array( 'zoom', 'product', 'shop', 'detail', 'ecommerce' ),
		'content'     => bpivb_pattern_group(
			bpivb_pattern_columns(
				bpivb_pattern_block(
					array(
						'viewerType' => 'zoom',
						'img'        => array( 'id' => null, 'url' => $detail, 'alt' => __( 'Survey readings, 2019 to 2026', 'image-viewer' ), 'title' => '' ),
						'width'      => '100%',
						'height'     => '460px',
						'zoom'       => array(
							'disablePan'         => false,
							'disableZoom'        => false,
							'disableXAxis'       => false,
							'disableYAxis'       => false,
							'duration'           => 200,
							'panOnlyWhenZoomed'  => true,
							'startScale'         => 1,
							'step'               => 0.3,
						),
					)
				),
				bpivb_pattern_heading( __( 'Look closer', 'image-viewer' ), 2, false )
				. bpivb_pattern_paragraph( __( 'Scroll or pinch to zoom, then drag to move around. Everything stays sharp because nothing is being scaled up from a thumbnail.', 'image-viewer' ), false )
				. bpivb_pattern_paragraph( __( 'Replace the placeholder with your own photograph, drawing or plate.', 'image-viewer' ), false )
			),
			'wide'
		),
	);

	/* Magnify -------------------------------------------------------------- */
	$patterns['detail-magnifier'] = array(
		'title'       => __( 'Magnifier over fine detail', 'image-viewer' ),
		'description' => __( 'A magnifying lens that follows the cursor, for artwork, fabric, maps or anything with detail worth inspecting.', 'image-viewer' ),
		'keywords'    => array( 'magnify', 'magnifier', 'lens', 'detail', 'artwork' ),
		'content'     => bpivb_pattern_group(
			bpivb_pattern_heading( __( 'Move your cursor across the plate', 'image-viewer' ) )
			. bpivb_pattern_paragraph( __( 'The lens follows wherever you point. On a touchscreen, hold and drag.', 'image-viewer' ) )
			. bpivb_pattern_spacer( 24 )
			. bpivb_pattern_block(
				array(
					'viewerType' => 'magnify',
					'img'        => array( 'id' => null, 'url' => $detail, 'alt' => __( 'Survey readings, 2019 to 2026', 'image-viewer' ), 'title' => '' ),
					'width'      => '100%',
					'height'     => '520px',
				)
			),
			'wide'
		),
	);

	/* Image map ------------------------------------------------------------ */
	$patterns['interactive-floor-plan'] = array(
		'title'       => __( 'Interactive floor plan', 'image-viewer' ),
		'description' => __( 'A plan with four clickable areas, each linking somewhere. Works equally for a venue map, a diagram or a labelled photograph.', 'image-viewer' ),
		'keywords'    => array( 'image map', 'hotspot', 'floor plan', 'diagram', 'clickable' ),
		'content'     => bpivb_pattern_group(
			bpivb_pattern_heading( __( 'Find your way around', 'image-viewer' ) )
			. bpivb_pattern_paragraph( __( 'Four areas, each linking to its own page. Drag any area in the editor to reposition it over your own image.', 'image-viewer' ) )
			. bpivb_pattern_spacer( 24 )
			. bpivb_pattern_block(
				array(
					'viewerType' => 'map',
					'img'        => array( 'id' => null, 'url' => $plan, 'alt' => __( 'Floor plan of the building', 'image-viewer' ), 'title' => '' ),
					'width'      => '100%',
					'height'     => '520px',
					'maps'       => array(
						bpivb_pattern_hotspot( 60, 60, 240, 200, __( 'Studio', 'image-viewer' ) ),
						bpivb_pattern_hotspot( 340, 60, 300, 200, __( 'Workshop', 'image-viewer' ) ),
						bpivb_pattern_hotspot( 60, 300, 280, 170, __( 'Gallery', 'image-viewer' ) ),
						bpivb_pattern_hotspot( 380, 300, 260, 170, __( 'Café', 'image-viewer' ) ),
					),
				)
			),
			'wide'
		),
	);

	/* Panorama -------------------------------------------------------------- */
	$patterns['panorama-tour'] = array(
		'title'       => __( '360° panorama tour', 'image-viewer' ),
		'description' => __( 'A rotating 360° view that turns on its own until a visitor takes hold of it — for a room, a venue or a landscape.', 'image-viewer' ),
		'keywords'    => array( 'panorama', '360', 'rotation', 'tour', 'virtual tour' ),
		'content'     => bpivb_pattern_group(
			bpivb_pattern_heading( __( 'Have a look around', 'image-viewer' ) )
			. bpivb_pattern_paragraph( __( 'Drag to turn. It rotates by itself until you do.', 'image-viewer' ) )
			. bpivb_pattern_spacer( 24 )
			. bpivb_pattern_block(
				array(
					'viewerType'  => 'pano',
					// A 2:1 strip whose left and right edges meet, which is what a
					// 360° viewer needs; a normal photograph shows a seam.
					'img'         => array( 'id' => null, 'url' => $pano, 'alt' => __( 'Panoramic view of the valley', 'image-viewer' ), 'title' => '' ),
					'width'       => '100%',
					'height'      => '480px',
					'autoRotate'  => true,
					'rotateSpeed' => 2,
					// The viewer reads this as 'show the control bar', not 'hide it'.
					'hideControl' => true,
					'autoPlay'    => true,
					// A 360° view read at content width is mostly sky; it needs
					// the room the group already gives it.
					'align'       => 'wide',
				)
			),
			'full'
		),
	);

	/*
	 * Pattern search matches title, description and keywords — not the category
	 * label. Someone who has just read "Image Viewers" in the category list and
	 * types it into the search box would otherwise get nothing back.
	 */
	$base_keywords = array(
		__( 'image', 'image-viewer' ),
		__( 'image viewer', 'image-viewer' ),
		__( 'image viewers', 'image-viewer' ),
	);

	foreach ( $patterns as $slug => $pattern ) {
		register_block_pattern(
			'image-viewer/' . $slug,
			array(
				'title'       => $pattern['title'],
				'description' => $pattern['description'],
				'categories'  => array( $category ),
				'keywords'    => array_values( array_unique( array_merge( $base_keywords, $pattern['keywords'] ) ) ),
				'content'     => $pattern['content'],
			)
		);
	}
}

/**
 * Late on init: register_block_pattern() silently drops a pattern whose blocks
 * are not registered yet, and the block registers on init at the default
 * priority.
 */
add_action( 'init', 'bpivb_register_patterns', 20 );
