<?php
/**
 * Plugin Name: OMOS Page Generator
 * Description: Creates the required OMOS pages with shortcodes and mobile-responsive wrapper markup.
 * Version: 1.0.0
 * Author: ONEGODIAN, LLC
 */

if (!defined('ABSPATH')) {
    exit;
}

function omos_required_pages_manifest() {
    return array(
        array(
            'title' => 'OMOS',
            'slug' => 'omos',
            'shortcode' => '[omos_home]',
            'description' => 'OMOS public landing page and platform gateway.'
        ),
        array(
            'title' => 'OMOS-1.0 Protocol Specification',
            'slug' => 'omos-1-0-protocol-specification',
            'shortcode' => '[omos_protocol_spec]',
            'description' => 'Canonical OMOS-1.0 protocol specification page.'
        ),
        array(
            'title' => 'What Is OMOS?',
            'slug' => 'what-is-omos',
            'shortcode' => '[omos_explainer]',
            'description' => 'Plain-language explanation of the OMOS system.'
        ),
        array(
            'title' => 'OneGodian Algorithm',
            'slug' => 'onegodian-algorithm',
            'shortcode' => '[omos_algorithm]',
            'description' => 'Overview of the OMOS Observe, Distill, Align, Select, Execute, Verify algorithm.'
        ),
        array(
            'title' => 'OMOS Developer Docs',
            'slug' => 'developer-docs',
            'shortcode' => '[omos_developer_docs]',
            'description' => 'Developer documentation and API entry point for OMOS.'
        ),
        array(
            'title' => 'OMOS Dashboard',
            'slug' => 'dashboard',
            'shortcode' => '[omos_dashboard]',
            'description' => 'Developer dashboard for API keys, usage, plans, and endpoint status.'
        ),
        array(
            'title' => 'Contact OMOS',
            'slug' => 'contact',
            'shortcode' => '[omos_contact]',
            'description' => 'Contact, support, licensing, and implementation inquiry page.'
        )
    );
}

function omos_page_content_template($shortcode, $description) {
    return '<!-- OMOS auto-generated page. Do not remove shortcode unless replacing with a custom template. -->' . "\n" .
        '<section class="omos-shortcode-page" data-omos-generated="true">' . "\n" .
        '  <div class="omos-shortcode-shell">' . "\n" .
        '    <p class="omos-page-description">' . esc_html($description) . '</p>' . "\n" .
        '    ' . $shortcode . "\n" .
        '  </div>' . "\n" .
        '</section>';
}

function omos_generate_required_pages() {
    if (!current_user_can('manage_options')) {
        return new WP_Error('omos_forbidden', 'Only administrators can generate OMOS pages.');
    }

    $created = array();
    $updated = array();
    $skipped = array();

    foreach (omos_required_pages_manifest() as $page) {
        $existing = get_page_by_path($page['slug'], OBJECT, 'page');
        $content = omos_page_content_template($page['shortcode'], $page['description']);

        if ($existing) {
            $existing_content = (string) $existing->post_content;

            if (strpos($existing_content, $page['shortcode']) === false) {
                wp_update_post(array(
                    'ID' => $existing->ID,
                    'post_content' => $content,
                    'post_status' => 'publish'
                ));
                $updated[] = $page['slug'];
            } else {
                $skipped[] = $page['slug'];
            }
            continue;
        }

        $post_id = wp_insert_post(array(
            'post_title' => $page['title'],
            'post_name' => $page['slug'],
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_content' => $content,
            'comment_status' => 'closed',
            'ping_status' => 'closed'
        ));

        if (!is_wp_error($post_id) && $post_id) {
            update_post_meta($post_id, '_omos_generated_page', '1');
            update_post_meta($post_id, '_omos_shortcode', $page['shortcode']);
            $created[] = $page['slug'];
        }
    }

    return array(
        'created' => $created,
        'updated' => $updated,
        'skipped' => $skipped
    );
}

function omos_register_page_generator_admin() {
    add_submenu_page(
        'tools.php',
        'OMOS Page Generator',
        'OMOS Page Generator',
        'manage_options',
        'omos-page-generator',
        'omos_page_generator_admin_screen'
    );
}
add_action('admin_menu', 'omos_register_page_generator_admin');

function omos_page_generator_admin_screen() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $result = null;

    if (isset($_POST['omos_generate_pages'])) {
        check_admin_referer('omos_generate_pages_action');
        $result = omos_generate_required_pages();
    }

    echo '<div class="wrap">';
    echo '<h1>OMOS Page Generator</h1>';
    echo '<p>This tool creates the required OMOS pages with shortcode placeholders and mobile-responsive wrapper markup.</p>';

    if ($result && !is_wp_error($result)) {
        echo '<div class="notice notice-success"><p><strong>OMOS pages processed.</strong></p>';
        echo '<p>Created: ' . esc_html(implode(', ', $result['created'])) . '</p>';
        echo '<p>Updated: ' . esc_html(implode(', ', $result['updated'])) . '</p>';
        echo '<p>Skipped: ' . esc_html(implode(', ', $result['skipped'])) . '</p></div>';
    }

    echo '<form method="post">';
    wp_nonce_field('omos_generate_pages_action');
    submit_button('Generate / Repair OMOS Pages', 'primary', 'omos_generate_pages');
    echo '</form>';
    echo '</div>';
}

function omos_shortcode_responsive_styles() {
    echo '<style id="omos-shortcode-responsive-styles">
      .omos-shortcode-page{width:100%;background:#07090d;color:#d8d2c8;padding:clamp(32px,6vw,88px) 18px;box-sizing:border-box;overflow-x:hidden;}
      .omos-shortcode-shell{width:min(1120px,100%);margin:0 auto;border:1px solid rgba(214,184,91,.18);background:rgba(15,20,29,.72);padding:clamp(20px,4vw,48px);box-sizing:border-box;}
      .omos-page-description{color:#aaa297;font-size:clamp(15px,2.5vw,18px);line-height:1.65;margin:0 0 24px;}
      .omos-shortcode-shell img,.omos-shortcode-shell video,.omos-shortcode-shell iframe{max-width:100%;height:auto;}
      .omos-shortcode-shell table{width:100%;display:block;overflow-x:auto;border-collapse:collapse;}
      .omos-shortcode-shell pre{max-width:100%;overflow-x:auto;white-space:pre-wrap;word-break:break-word;}
      @media(max-width:768px){.omos-shortcode-page{padding:28px 14px}.omos-shortcode-shell{padding:22px}.omos-shortcode-shell h1{font-size:clamp(28px,10vw,44px)}.omos-shortcode-shell h2{font-size:clamp(22px,7vw,34px)}}
    </style>';
}
add_action('wp_head', 'omos_shortcode_responsive_styles');
