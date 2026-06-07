<?php
/**
 * Plugin Name: OneGodian Mega Menu Builder
 * Description: Builds and maintains the OMOS/OHI/Tools/Artifacts/Docs persistent mega menu structure for OneGodian and OMOS WordPress pages.
 * Version: 1.0.0
 * Author: ONEGODIAN, LLC
 */

if (!defined('ABSPATH')) { exit; }

final class OneGodian_Mega_Menu_Builder {
    const VERSION = '1.0.0';
    const MENU_SLUG = 'onegodian-mega-menu-builder';
    const OPTION_KEY = 'onegodian_mega_menu_builder_settings';

    private static $instance = null;

    public static function instance() {
        if (!self::$instance) { self::$instance = new self(); }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('wp_head', array($this, 'css'));
        add_action('wp_footer', array($this, 'js'));
    }

    public function menu_tree() {
        return array(
            'OMOS' => array(
                'url' => '/omos',
                'children' => array(
                    'What Is OMOS' => '/what-is-omos',
                    'Protocol' => '/omos-1-0-protocol-specification',
                    'Runtime' => '/runtime',
                    'API' => '/docs/api',
                    'Dashboard' => '/dashboard',
                    'Docs' => '/docs'
                )
            ),
            'OHI' => array(
                'url' => '/ohi',
                'children' => array(
                    'Overview' => '/ohi',
                    'Models' => '/models',
                    'Registry' => '/registry',
                    'Verification' => '/verify',
                    'Intelligence Layers' => '/ohi/intelligence-layers'
                )
            ),
            'Tools' => array(
                'url' => '/tools',
                'children' => array(
                    'Belief Mapper' => '/tools/belief-mapper',
                    'Consensus Counter' => '/tools/consensus-counter',
                    'Timekeeping' => '/tools/timekeeping',
                    'Generators' => '/tools/generators',
                    'Converters' => '/tools/converters'
                )
            ),
            'Artifacts' => array(
                'url' => '/artifacts',
                'children' => array(
                    'Featured' => '/artifacts/featured',
                    'Downloads' => '/artifacts/downloads',
                    'Records' => '/artifacts/records',
                    'Verification' => '/artifacts/verification'
                )
            ),
            'Docs' => array(
                'url' => '/docs',
                'children' => array(
                    'Getting Started' => '/docs/getting-started',
                    'Protocol' => '/docs/protocol',
                    'API' => '/docs/api',
                    'Compliance' => '/docs/compliance',
                    'Versioning' => '/docs/versioning'
                )
            )
        );
    }

    public function register_shortcodes() {
        add_shortcode('onegodian_mega_menu', array($this, 'render_shortcode'));
        add_shortcode('omos_mega_menu', array($this, 'render_shortcode'));
    }

    public function render_shortcode() {
        return $this->render_menu();
    }

    public function render_menu() {
        $tree = $this->menu_tree();
        ob_start();
        echo '<nav class="og-mega-menu" aria-label="OMOS Mega Menu">';
        echo '<div class="og-mega-inner">';
        echo '<a class="og-mega-brand" href="' . esc_url(home_url('/omos')) . '"><span>OG</span><strong>ONEGODIAN</strong><small>OMOS Platform</small></a>';
        echo '<div class="og-mega-groups">';
        foreach ($tree as $label => $group) {
            echo '<div class="og-mega-group">';
            echo '<a class="og-mega-top" href="' . esc_url(home_url($group['url'])) . '">' . esc_html($label) . '</a>';
            echo '<div class="og-mega-panel">';
            foreach ($group['children'] as $child_label => $child_url) {
                echo '<a href="' . esc_url(home_url($child_url)) . '"><strong>' . esc_html($child_label) . '</strong><span>' . esc_html($this->description_for($child_label)) . '</span></a>';
            }
            echo '</div></div>';
        }
        echo '</div>';
        echo '<a class="og-mega-cta" href="' . esc_url(home_url('/dashboard')) . '">Open Console</a>';
        echo '<button class="og-mega-mobile-toggle" type="button" aria-expanded="false">☰</button>';
        echo '</div>';
        echo '<div class="og-mega-mobile">';
        foreach ($tree as $label => $group) {
            echo '<details><summary>' . esc_html($label) . '</summary>';
            foreach ($group['children'] as $child_label => $child_url) {
                echo '<a href="' . esc_url(home_url($child_url)) . '">' . esc_html($child_label) . '</a>';
            }
            echo '</details>';
        }
        echo '<a class="og-mega-mobile-cta" href="' . esc_url(home_url('/dashboard')) . '">Open Console</a>';
        echo '</div>';
        echo '</nav>';
        return ob_get_clean();
    }

    private function description_for($label) {
        $map = array(
            'What Is OMOS' => 'Plain-language overview',
            'Protocol' => 'OMOS specification and rules',
            'Runtime' => 'Node and execution layer',
            'API' => 'Developer endpoint references',
            'Dashboard' => 'Console and account tools',
            'Docs' => 'Documentation index',
            'Overview' => 'Framework summary',
            'Models' => 'Model and synthesis library',
            'Registry' => 'Record index',
            'Verification' => 'Lookup and status tools',
            'Intelligence Layers' => 'OHI structure',
            'Belief Mapper' => 'Identity and belief mapping',
            'Consensus Counter' => 'Engagement counter tool',
            'Timekeeping' => 'Time tools and converters',
            'Generators' => 'Prompt and content generators',
            'Converters' => 'Conversion utilities',
            'Featured' => 'Featured resources',
            'Downloads' => 'Downloadable artifacts',
            'Records' => 'Registered materials',
            'Getting Started' => 'First steps',
            'Compliance' => 'Legal and policy controls',
            'Versioning' => 'Release discipline'
        );
        return isset($map[$label]) ? $map[$label] : 'Open section';
    }

    public function build_wp_menu() {
        $menu_name = 'OMOS Mega Menu';
        $menu = wp_get_nav_menu_object($menu_name);
        $menu_id = $menu ? (int) $menu->term_id : wp_create_nav_menu($menu_name);
        $tree = $this->menu_tree();
        foreach ($tree as $label => $group) {
            $parent_id = wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-title' => $label,
                'menu-item-url' => home_url($group['url']),
                'menu-item-status' => 'publish'
            ));
            foreach ($group['children'] as $child_label => $child_url) {
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title' => $child_label,
                    'menu-item-url' => home_url($child_url),
                    'menu-item-parent-id' => $parent_id,
                    'menu-item-status' => 'publish'
                ));
            }
        }
        return $menu_id;
    }

    public function admin_menu() {
        add_submenu_page('tools.php', 'OneGodian Mega Menu Builder', 'OneGodian Mega Menu Builder', 'manage_options', self::MENU_SLUG, array($this, 'screen'));
    }

    public function screen() {
        if (!current_user_can('manage_options')) { wp_die('Unauthorized'); }
        if (isset($_POST['og_build_mega_menu'])) {
            check_admin_referer('og_build_mega_menu');
            $id = $this->build_wp_menu();
            echo '<div class="notice notice-success"><p>OMOS Mega Menu built. Menu ID: ' . esc_html($id) . '</p></div>';
        }
        echo '<div class="wrap"><h1>OneGodian Mega Menu Builder</h1><p>Builds the OMOS/OHI/Tools/Artifacts/Docs navigation tree.</p>';
        echo '<form method="post">';
        wp_nonce_field('og_build_mega_menu');
        submit_button('Build / Repair OMOS Mega Menu', 'primary', 'og_build_mega_menu');
        echo '</form><h2>Shortcode</h2><p><code>[onegodian_mega_menu]</code></p><h2>Menu Tree</h2><pre>' . esc_html(print_r($this->menu_tree(), true)) . '</pre></div>';
    }

    public function css() {
        echo '<style id="onegodian-mega-menu-css">
        .og-mega-menu{position:sticky;top:0;z-index:9998;background:rgba(7,6,7,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(216,179,90,.18);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.og-mega-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:18px;padding:13px 18px}.og-mega-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#f5f1e8;min-width:210px}.og-mega-brand span{width:40px;height:40px;border-radius:14px;background:rgba(216,179,90,.12);border:1px solid rgba(216,179,90,.36);display:flex;align-items:center;justify-content:center;color:#f0d98a;font-weight:900}.og-mega-brand strong{display:block;color:#f5f1e8;line-height:1}.og-mega-brand small{display:block;color:#f0d98a;font-size:11px}.og-mega-groups{display:flex;align-items:center;justify-content:center;gap:3px;flex:1}.og-mega-group{position:relative}.og-mega-top{display:block;color:rgba(245,241,232,.88);text-decoration:none;font-weight:800;font-size:13px;padding:11px 13px;border-radius:14px}.og-mega-group:hover .og-mega-top{background:rgba(216,179,90,.10);color:#f0d98a}.og-mega-panel{position:absolute;top:100%;left:50%;transform:translateX(-50%);width:320px;display:none;grid-template-columns:1fr;gap:8px;background:#0d0a12;border:1px solid rgba(216,179,90,.22);box-shadow:0 22px 60px rgba(0,0,0,.42);border-radius:18px;padding:12px}.og-mega-group:hover .og-mega-panel{display:grid}.og-mega-panel a{display:block;text-decoration:none;color:#f5f1e8;border:1px solid rgba(216,179,90,.12);background:rgba(255,255,255,.035);padding:12px;border-radius:14px}.og-mega-panel a:hover{border-color:rgba(216,179,90,.34);background:rgba(216,179,90,.08)}.og-mega-panel strong{display:block;font-size:13px;color:#f5f1e8}.og-mega-panel span{display:block;font-size:11px;color:rgba(245,241,232,.58);margin-top:3px}.og-mega-cta,.og-mega-mobile-cta{display:inline-block;text-decoration:none;background:#f0d98a;color:#070607!important;border-radius:999px;padding:10px 15px;font-weight:900;font-size:13px}.og-mega-mobile-toggle{display:none;border:1px solid rgba(216,179,90,.28);background:rgba(255,255,255,.04);color:#f5f1e8;border-radius:12px;padding:9px 12px;font-size:20px}.og-mega-mobile{display:none;background:#070607;border-top:1px solid rgba(216,179,90,.14);padding:12px 18px}.og-mega-mobile details{border:1px solid rgba(216,179,90,.14);border-radius:14px;margin-bottom:8px;background:rgba(255,255,255,.035);color:#f5f1e8}.og-mega-mobile summary{cursor:pointer;padding:12px;font-weight:900}.og-mega-mobile a{display:block;color:#f5f1e8;text-decoration:none;padding:10px 14px;border-top:1px solid rgba(216,179,90,.10)}.og-mega-menu.is-open .og-mega-mobile{display:block}@media(max-width:1100px){.og-mega-groups,.og-mega-cta{display:none}.og-mega-mobile-toggle{display:inline-block;margin-left:auto}.og-mega-brand{min-width:unset}}@media(max-width:720px){.og-mega-inner{padding:11px 12px}.og-mega-brand small{display:none}.og-mega-brand strong{font-size:13px}}
        </style>';
    }

    public function js() {
        echo '<script id="onegodian-mega-menu-js">document.addEventListener("click",function(e){var b=e.target.closest(".og-mega-mobile-toggle");if(!b)return;var m=b.closest(".og-mega-menu");if(!m)return;var o=m.classList.toggle("is-open");b.setAttribute("aria-expanded",o?"true":"false");});</script>';
    }
}

OneGodian_Mega_Menu_Builder::instance();
