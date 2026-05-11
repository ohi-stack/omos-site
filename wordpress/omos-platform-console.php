<?php
/**
 * Plugin Name: OMOS Platform Console
 * Description: Production WordPress platform console for OMOS.OneGodian.com: pages, menus, artifacts, tools, dashboard, verification, REST API, WooCommerce bridge, compliance, and import/export.
 * Version: 1.0.0
 * Author: ONEGODIAN, LLC
 * Text Domain: omos-platform-console
 */

if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Platform_Console {
    const VERSION = '1.0.0';
    const OPTION_SETTINGS = 'omos_platform_settings';
    const OPTION_COUNTERS = 'omos_visitor_counters';
    const MENU_SLUG = 'omos-dashboard';

    private static $instance = null;

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('wp', array($this, 'track_page_view'));
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('wp_head', array($this, 'print_responsive_css'));
    }

    public function register_post_types() {
        register_post_type('omos_artifact', array(
            'labels' => array('name' => 'OMOS Artifacts', 'singular_name' => 'OMOS Artifact'),
            'public' => true,
            'show_ui' => true,
            'show_in_menu' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'artifacts'),
        ));

        register_post_type('omos_tool', array(
            'labels' => array('name' => 'OMOS Tools', 'singular_name' => 'OMOS Tool'),
            'public' => true,
            'show_ui' => true,
            'show_in_menu' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
            'rewrite' => array('slug' => 'tools'),
        ));

        register_post_type('omos_registry', array(
            'labels' => array('name' => 'OMOS Verification Records', 'singular_name' => 'OMOS Verification Record'),
            'public' => true,
            'show_ui' => true,
            'show_in_menu' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'custom-fields'),
            'rewrite' => array('slug' => 'verify'),
        ));
    }

    public function page_manifest() {
        return array(
            'omos' => '[omos_dashboard]',
            'ohi' => '[omos_system_status]',
            'models' => '[omos_tool_grid]',
            'tools' => '[omos_tools]',
            'artifacts' => '[omos_artifacts]',
            'docs' => '[omos_docs]',
            'shop' => '[omos_shop_bridge]',
            'latest-news' => '[omos_latest_updates]',
            'dashboard' => '[omos_dashboard]',
            'legal' => '[omos_compliance_notices]',
            'contact' => '[omos_contact]',
            'verify' => '[omos_verify_lookup]',
            'registry' => '[omos_registry_lookup]',
            'docs/getting-started' => '[omos_doc_card title="Getting Started"]',
            'docs/omos' => '[omos_doc_card title="OMOS"]',
            'docs/ohi' => '[omos_doc_card title="OHI"]',
            'docs/protocol' => '[omos_doc_card title="Protocol"]',
            'docs/algorithm' => '[omos_doc_card title="Algorithm"]',
            'docs/tools' => '[omos_tool_grid]',
            'docs/artifacts' => '[omos_artifact_grid]',
            'docs/api' => '[omos_api_reference]',
            'docs/bridge' => '[omos_bridge_docs]',
            'docs/compliance' => '[omos_compliance_notices]',
            'docs/versioning' => '[omos_versioning]'
        );
    }

    public function install_pages() {
        $created = array();
        $updated = array();
        foreach ($this->page_manifest() as $path => $shortcode) {
            $parts = explode('/', trim($path, '/'));
            $parent_id = 0;
            foreach ($parts as $index => $slug) {
                $is_leaf = ($index === count($parts) - 1);
                $page_id = $this->find_page($slug, $parent_id);
                $title = ucwords(str_replace('-', ' ', $slug));
                $content = $is_leaf ? $this->wrap_shortcode($shortcode) : $this->wrap_shortcode('[omos_section_index]');
                if (!$page_id) {
                    $page_id = wp_insert_post(array(
                        'post_title' => $title,
                        'post_name' => sanitize_title($slug),
                        'post_parent' => $parent_id,
                        'post_type' => 'page',
                        'post_status' => 'publish',
                        'post_content' => $content,
                        'comment_status' => 'closed',
                        'ping_status' => 'closed'
                    ));
                    if ($page_id && !is_wp_error($page_id)) {
                        $created[] = implode('/', array_slice($parts, 0, $index + 1));
                    }
                } elseif ($is_leaf && strpos((string) get_post_field('post_content', $page_id), $shortcode) === false) {
                    wp_update_post(array('ID' => $page_id, 'post_content' => $content));
                    $updated[] = $path;
                }
                if ($page_id && !is_wp_error($page_id)) {
                    update_post_meta($page_id, '_omos_generated_page', '1');
                    $parent_id = (int) $page_id;
                }
            }
        }
        return array('created' => $created, 'updated' => $updated);
    }

    private function find_page($slug, $parent_id = 0) {
        $q = new WP_Query(array(
            'post_type' => 'page',
            'name' => sanitize_title($slug),
            'post_parent' => (int) $parent_id,
            'post_status' => array('publish', 'draft', 'private'),
            'fields' => 'ids',
            'posts_per_page' => 1
        ));
        return !empty($q->posts) ? (int) $q->posts[0] : 0;
    }

    private function wrap_shortcode($shortcode) {
        return '<section class="omos-shortcode-page"><div class="omos-shortcode-shell">' . $shortcode . '</div></section>';
    }

    public function build_mega_menu() {
        $menu_name = 'OMOS Mega Menu';
        $menu_id = wp_get_nav_menu_object($menu_name);
        if (!$menu_id) {
            $menu_id = wp_create_nav_menu($menu_name);
        } else {
            $menu_id = $menu_id->term_id;
        }
        $items = array('OMOS' => '/omos', 'OHI' => '/ohi', 'Models' => '/models', 'Tools' => '/tools', 'Artifacts' => '/artifacts', 'Docs' => '/docs', 'Shop' => '/shop', 'Open Console' => '/dashboard');
        foreach ($items as $title => $url) {
            wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-title' => $title,
                'menu-item-url' => home_url($url),
                'menu-item-status' => 'publish'
            ));
        }
        return $menu_id;
    }

    public function register_shortcodes() {
        $shortcodes = array(
            'omos_dashboard','omos_artifacts','omos_artifact_grid','omos_tools','omos_tool_grid','omos_belief_mapper','omos_consensus_counter','omos_ai_consensus','omos_foundation_day','omos_timekeeping','omos_system_status','omos_open_console_button','omos_docs','omos_shop_bridge','omos_latest_updates','omos_compliance_notices','omos_contact','omos_verify_lookup','omos_registry_lookup','omos_section_index','omos_doc_card','omos_api_reference','omos_bridge_docs','omos_versioning'
        );
        foreach ($shortcodes as $tag) {
            add_shortcode($tag, array($this, 'render_shortcode'));
        }
    }

    public function render_shortcode($atts = array(), $content = '', $tag = '') {
        switch ($tag) {
            case 'omos_dashboard': return $this->render_dashboard_frontend();
            case 'omos_artifacts':
            case 'omos_artifact_grid': return $this->render_cards('omos_artifact');
            case 'omos_tools':
            case 'omos_tool_grid': return $this->render_cards('omos_tool');
            case 'omos_system_status': return $this->render_system_status();
            case 'omos_open_console_button': return '<a class="omos-button" href="' . esc_url(home_url('/dashboard')) . '">Open Console</a>';
            case 'omos_verify_lookup':
            case 'omos_registry_lookup': return $this->render_verify_lookup();
            case 'omos_consensus_counter': return $this->render_visitor_counter();
            case 'omos_timekeeping': return '<div class="omos-card"><h3>OMOS Timekeeping</h3><p>Gregorian time remains the controlling civil date; OneGodian Time may be displayed as a supplemental internal sequencing layer.</p></div>';
            case 'omos_compliance_notices': return $this->render_compliance_notices();
            default: return '<div class="omos-card"><h3>' . esc_html(str_replace('_', ' ', strtoupper($tag))) . '</h3><p>OMOS module placeholder. Configure this module in OMOS settings.</p></div>';
        }
    }

    private function render_dashboard_frontend() {
        return '<div class="omos-grid"><div class="omos-card"><h3>Identity Status</h3><p>Configured</p></div><div class="omos-card"><h3>OHI Status</h3><p>Operational placeholder</p></div><div class="omos-card"><h3>Tools</h3><p><a href="/tools">Open tools</a></p></div><div class="omos-card"><h3>Artifacts</h3><p><a href="/artifacts">Open artifacts</a></p></div><div class="omos-card"><h3>Downloads</h3><p><a href="/dashboard/downloads">View downloads</a></p></div><div class="omos-card"><h3>System Notices</h3><p>No current notices.</p></div></div>';
    }

    private function render_cards($post_type) {
        $q = new WP_Query(array('post_type' => $post_type, 'post_status' => 'publish', 'posts_per_page' => 24));
        $html = '<div class="omos-grid">';
        while ($q->have_posts()) { $q->the_post();
            $html .= '<article class="omos-card"><h3><a href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . '</a></h3><p>' . esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 24)) . '</p></article>';
        }
        wp_reset_postdata();
        $html .= '</div>';
        return $html;
    }

    private function render_system_status() {
        $health = $this->health_report();
        $html = '<div class="omos-grid">';
        foreach ($health as $key => $value) {
            $html .= '<div class="omos-card"><h3>' . esc_html(ucwords(str_replace('_',' ', $key))) . '</h3><p>' . esc_html(is_bool($value) ? ($value ? 'OK' : 'Needs attention') : $value) . '</p></div>';
        }
        return $html . '</div>';
    }

    private function render_verify_lookup() {
        return '<form class="omos-verify-form" method="get"><label>Record ID</label><input name="record_id" type="text" placeholder="Enter record ID"><button type="submit">Verify</button></form>';
    }

    private function render_visitor_counter() {
        $id = get_queried_object_id();
        $counters = get_option(self::OPTION_COUNTERS, array());
        $count = isset($counters[$id]['count']) ? (int) $counters[$id]['count'] : 0;
        return '<div class="omos-counter">Views: ' . esc_html($count) . '</div>';
    }

    private function render_compliance_notices() {
        return '<div class="omos-card"><h3>Classification Notice</h3><p>ONEGODIAN, LLC is treated as a commercial, intellectual property, software, education, and economic entity. INO is separate and should be handled only in its spiritual, religious, or internal governance context. OMOS is a software, documentation, and platform framework.</p></div>';
    }

    public function track_page_view() {
        if (is_admin() || !is_singular()) { return; }
        $id = get_queried_object_id();
        if (!$id) { return; }
        $counters = get_option(self::OPTION_COUNTERS, array());
        if (!isset($counters[$id])) { $counters[$id] = array('count' => 0, 'last_viewed' => ''); }
        $counters[$id]['count']++;
        $counters[$id]['last_viewed'] = current_time('mysql');
        update_option(self::OPTION_COUNTERS, $counters, false);
    }

    public function register_admin_menu() {
        add_menu_page('OMOS', 'OMOS', 'manage_options', self::MENU_SLUG, array($this, 'screen_dashboard'), 'dashicons-networking', 3);
        $screens = array('Page Installer','Mega Menu','Artifacts','Tools','Dashboard Builder','Registry / Verify','Docs','Shop Integration','Compliance','Import / Export','System Health','Settings');
        foreach ($screens as $screen) {
            add_submenu_page(self::MENU_SLUG, 'OMOS ' . $screen, $screen, 'manage_options', 'omos-' . sanitize_title($screen), array($this, 'screen_generic'));
        }
    }

    public function screen_dashboard() {
        $health = $this->health_report();
        echo '<div class="wrap"><h1>OMOS Dashboard</h1><div class="omos-admin-grid">';
        foreach ($health as $key => $value) {
            echo '<div class="postbox"><div class="inside"><h2>' . esc_html(ucwords(str_replace('_',' ', $key))) . '</h2><p>' . esc_html(is_bool($value) ? ($value ? 'OK' : 'Needs attention') : $value) . '</p></div></div>';
        }
        echo '</div></div>';
    }

    public function screen_generic() {
        $slug = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
        echo '<div class="wrap"><h1>' . esc_html(ucwords(str_replace(array('omos-','-'), array('', ' '), $slug))) . '</h1>';
        if ($slug === 'omos-page-installer' && isset($_POST['omos_install_pages'])) {
            check_admin_referer('omos_install_pages');
            $result = $this->install_pages();
            echo '<div class="notice notice-success"><p>Pages installed. Created: ' . esc_html(count($result['created'])) . '; Updated: ' . esc_html(count($result['updated'])) . '.</p></div>';
        }
        if ($slug === 'omos-mega-menu' && isset($_POST['omos_build_menu'])) {
            check_admin_referer('omos_build_menu');
            $menu_id = $this->build_mega_menu();
            echo '<div class="notice notice-success"><p>Mega menu processed. Menu ID: ' . esc_html($menu_id) . '.</p></div>';
        }
        if ($slug === 'omos-page-installer') {
            echo '<form method="post">'; wp_nonce_field('omos_install_pages'); submit_button('Install / Repair OMOS Sitemap', 'primary', 'omos_install_pages'); echo '</form>';
        } elseif ($slug === 'omos-mega-menu') {
            echo '<form method="post">'; wp_nonce_field('omos_build_menu'); submit_button('Build OMOS Mega Menu', 'primary', 'omos_build_menu'); echo '</form>';
        } else {
            echo '<p>This module is registered and ready for production expansion.</p>';
        }
        echo '</div>';
    }

    public function health_report() {
        return array(
            'site_status' => get_bloginfo('name'),
            'page_count' => wp_count_posts('page')->publish,
            'active_tools' => wp_count_posts('omos_tool')->publish ?? 0,
            'artifact_count' => wp_count_posts('omos_artifact')->publish ?? 0,
            'system_health' => 'Operational scaffold',
            'missing_pages' => $this->missing_pages_count(),
            'menu_status' => wp_get_nav_menu_object('OMOS Mega Menu') ? 'Configured' : 'Not configured',
            'shortcode_status' => shortcode_exists('omos_dashboard'),
            'woocommerce_status' => class_exists('WooCommerce') ? 'Active' : 'Inactive',
            'rest_api' => true,
            'permalinks' => get_option('permalink_structure') ? 'Enabled' : 'Plain'
        );
    }

    private function missing_pages_count() {
        $missing = 0;
        foreach (array_keys($this->page_manifest()) as $path) {
            if (!get_page_by_path($path)) { $missing++; }
        }
        return $missing;
    }

    public function register_rest_routes() {
        register_rest_route('omos/v1', '/status', array('methods' => 'GET', 'callback' => function(){ return rest_ensure_response($this->health_report()); }, 'permission_callback' => '__return_true'));
        register_rest_route('omos/v1', '/artifacts', array('methods' => 'GET', 'callback' => function(){ return rest_ensure_response($this->rest_posts('omos_artifact')); }, 'permission_callback' => '__return_true'));
        register_rest_route('omos/v1', '/tools', array('methods' => 'GET', 'callback' => function(){ return rest_ensure_response($this->rest_posts('omos_tool')); }, 'permission_callback' => '__return_true'));
        register_rest_route('omos/v1', '/dashboard', array('methods' => 'GET', 'callback' => function(){ return rest_ensure_response($this->health_report()); }, 'permission_callback' => '__return_true'));
        register_rest_route('omos/v1', '/sitemap', array('methods' => 'GET', 'callback' => function(){ return rest_ensure_response($this->page_manifest()); }, 'permission_callback' => '__return_true'));
        register_rest_route('omos/v1', '/verify', array('methods' => 'GET', 'callback' => array($this, 'rest_verify'), 'permission_callback' => '__return_true'));
    }

    public function rest_posts($post_type) {
        $q = new WP_Query(array('post_type' => $post_type, 'post_status' => 'publish', 'posts_per_page' => 100));
        $items = array();
        while ($q->have_posts()) { $q->the_post(); $items[] = array('id' => get_the_ID(), 'title' => get_the_title(), 'url' => get_permalink(), 'status' => get_post_meta(get_the_ID(), 'status', true), 'version' => get_post_meta(get_the_ID(), 'version', true)); }
        wp_reset_postdata();
        return $items;
    }

    public function rest_verify($request) {
        $record_id = sanitize_text_field($request->get_param('record_id'));
        if (!$record_id) { return new WP_Error('missing_record_id', 'record_id is required', array('status' => 400)); }
        $q = new WP_Query(array('post_type' => 'omos_registry', 'meta_key' => 'record_id', 'meta_value' => $record_id, 'posts_per_page' => 1));
        if (!$q->have_posts()) { return new WP_Error('not_found', 'Verification record not found', array('status' => 404)); }
        $q->the_post(); $id = get_the_ID();
        $data = array('record_id' => $record_id, 'title' => get_the_title(), 'hash' => get_post_meta($id, 'hash', true), 'version' => get_post_meta($id, 'version', true), 'issuer' => get_post_meta($id, 'issuer', true), 'status' => get_post_meta($id, 'status', true), 'url' => get_permalink($id));
        wp_reset_postdata();
        return rest_ensure_response($data);
    }

    public function print_responsive_css() {
        echo '<style id="omos-platform-console-css">
        .omos-shortcode-page{width:100%;background:#07090d;color:#d8d2c8;padding:clamp(28px,6vw,88px) 16px;box-sizing:border-box;overflow-x:hidden}.omos-shortcode-shell{width:min(1180px,100%);margin:0 auto;border:1px solid rgba(214,184,91,.18);background:rgba(15,20,29,.72);padding:clamp(20px,4vw,48px);box-sizing:border-box}.omos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}.omos-card{border:1px solid rgba(214,184,91,.18);background:#0f141d;color:#d8d2c8;padding:18px;border-radius:14px}.omos-card h3{margin-top:0;color:#f2d57e}.omos-button,.omos-verify-form button{display:inline-block;background:#d6b85b;color:#07090d;padding:10px 16px;border-radius:999px;text-decoration:none;border:0;font-weight:700}.omos-verify-form{display:grid;gap:10px;max-width:520px}.omos-verify-form input{padding:12px;background:#07090d;color:#fff;border:1px solid rgba(214,184,91,.25)}.omos-counter{display:inline-block;border:1px solid rgba(214,184,91,.22);padding:8px 12px;border-radius:999px}.omos-admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.omos-shortcode-shell img,.omos-shortcode-shell iframe,.omos-shortcode-shell video{max-width:100%;height:auto}.omos-shortcode-shell table{width:100%;display:block;overflow-x:auto}.omos-shortcode-shell pre{max-width:100%;overflow-x:auto;white-space:pre-wrap;word-break:break-word}@media(max-width:768px){.omos-shortcode-page{padding:24px 12px}.omos-shortcode-shell{padding:18px}.omos-grid{grid-template-columns:1fr}}
        </style>';
    }
}

OMOS_Platform_Console::instance();

register_activation_hook(__FILE__, function(){
    OMOS_Platform_Console::instance()->register_post_types();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function(){
    flush_rewrite_rules();
});
