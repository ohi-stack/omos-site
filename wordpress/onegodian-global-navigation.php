<?php
/**
 * Plugin Name: OneGodian Global Navigation
 * Description: Persistent global navigation module for OneGodian/OMOS WordPress pages. Provides desktop navigation, mobile drawer, Open Console CTA, footer links, admin settings, shortcodes, and auto-injection support.
 * Version: 1.0.0
 * Author: ONEGODIAN, LLC
 * Text Domain: onegodian-global-navigation
 */

if (!defined('ABSPATH')) {
    exit;
}

final class OneGodian_Global_Navigation {
    const VERSION = '1.0.0';
    const OPTION_SETTINGS = 'onegodian_global_navigation_settings';
    const MENU_SLUG = 'onegodian-global-navigation';

    private static $instance = null;

    public static function instance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_shortcodes'));
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('wp_head', array($this, 'print_css'));
        add_action('wp_footer', array($this, 'print_js'));
        add_action('wp_body_open', array($this, 'maybe_auto_inject_header'));
        add_action('wp_footer', array($this, 'maybe_auto_inject_footer'), 5);
    }

    public function default_settings() {
        return array(
            'brand_label' => 'ONEGODIAN',
            'brand_subtitle' => 'OMOS Platform Console',
            'home_url' => '/omos',
            'console_url' => '/dashboard',
            'cta_label' => 'Open Console',
            'auto_header' => '1',
            'auto_footer' => '0',
            'show_top_notice' => '1',
            'top_notice' => 'OMOS pages, tools, artifacts, dashboard, documentation, verification, and forms are managed through the OneGodian platform console.',
            'nav_items' => wp_json_encode($this->default_nav_items()),
            'footer_items' => wp_json_encode($this->default_footer_items())
        );
    }

    public function get_settings() {
        return wp_parse_args(get_option(self::OPTION_SETTINGS, array()), $this->default_settings());
    }

    public function default_nav_items() {
        return array(
            array('label' => 'OMOS', 'url' => '/omos', 'description' => 'Platform overview'),
            array('label' => 'OHI', 'url' => '/ohi', 'description' => 'OHI status and framework'),
            array('label' => 'Models', 'url' => '/models', 'description' => 'Model library'),
            array('label' => 'Tools', 'url' => '/tools', 'description' => 'Tool library'),
            array('label' => 'Artifacts', 'url' => '/artifacts', 'description' => 'Artifact library'),
            array('label' => 'Docs', 'url' => '/docs', 'description' => 'Documentation'),
            array('label' => 'Shop', 'url' => '/shop', 'description' => 'Products and downloads')
        );
    }

    public function default_footer_items() {
        return array(
            array('label' => 'Dashboard', 'url' => '/dashboard'),
            array('label' => 'Verify', 'url' => '/verify'),
            array('label' => 'Registry', 'url' => '/registry'),
            array('label' => 'Legal', 'url' => '/legal'),
            array('label' => 'Contact', 'url' => '/contact'),
            array('label' => 'Development Inquiry', 'url' => '/development-inquiry'),
            array('label' => 'Business Inquiry', 'url' => '/business-inquiry'),
            array('label' => 'Contributor Intake', 'url' => '/contributor-intake')
        );
    }

    private function decode_items($json, $fallback) {
        $items = json_decode((string) $json, true);
        if (!is_array($items)) {
            return $fallback;
        }
        return $items;
    }

    public function register_shortcodes() {
        add_shortcode('onegodian_global_nav', array($this, 'render_nav_shortcode'));
        add_shortcode('onegodian_global_footer', array($this, 'render_footer_shortcode'));
        add_shortcode('onegodian_open_console_button', array($this, 'render_console_button_shortcode'));
    }

    public function render_nav_shortcode() {
        return $this->render_nav();
    }

    public function render_footer_shortcode() {
        return $this->render_footer_nav();
    }

    public function render_console_button_shortcode() {
        $s = $this->get_settings();
        return '<a class="og-nav-cta" href="' . esc_url(home_url($s['console_url'])) . '">' . esc_html($s['cta_label']) . '</a>';
    }

    public function maybe_auto_inject_header() {
        $s = $this->get_settings();
        if ($s['auto_header'] === '1') {
            echo $this->render_nav();
        }
    }

    public function maybe_auto_inject_footer() {
        $s = $this->get_settings();
        if ($s['auto_footer'] === '1') {
            echo $this->render_footer_nav();
        }
    }

    public function render_nav() {
        $s = $this->get_settings();
        $items = $this->decode_items($s['nav_items'], $this->default_nav_items());
        ob_start();
        echo '<header class="og-global-nav" role="banner">';
        if ($s['show_top_notice'] === '1' && !empty($s['top_notice'])) {
            echo '<div class="og-nav-notice"><span>' . esc_html($s['top_notice']) . '</span></div>';
        }
        echo '<div class="og-nav-inner">';
        echo '<a class="og-nav-brand" href="' . esc_url(home_url($s['home_url'])) . '"><span class="og-nav-mark">OG</span><span><strong>' . esc_html($s['brand_label']) . '</strong><small>' . esc_html($s['brand_subtitle']) . '</small></span></a>';
        echo '<nav class="og-nav-links" aria-label="Primary OneGodian Navigation">';
        foreach ($items as $item) {
            $label = isset($item['label']) ? $item['label'] : '';
            $url = isset($item['url']) ? $item['url'] : '#';
            $description = isset($item['description']) ? $item['description'] : '';
            echo '<a class="og-nav-link" href="' . esc_url(home_url($url)) . '"><span>' . esc_html($label) . '</span>';
            if ($description) {
                echo '<small>' . esc_html($description) . '</small>';
            }
            echo '</a>';
        }
        echo '</nav>';
        echo '<div class="og-nav-actions"><a class="og-nav-cta" href="' . esc_url(home_url($s['console_url'])) . '">' . esc_html($s['cta_label']) . '</a><button class="og-mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button></div>';
        echo '</div>';
        echo '<div class="og-mobile-drawer" aria-hidden="true"><div class="og-mobile-drawer-inner">';
        foreach ($items as $item) {
            $label = isset($item['label']) ? $item['label'] : '';
            $url = isset($item['url']) ? $item['url'] : '#';
            echo '<a href="' . esc_url(home_url($url)) . '">' . esc_html($label) . '</a>';
        }
        echo '<a class="og-mobile-cta" href="' . esc_url(home_url($s['console_url'])) . '">' . esc_html($s['cta_label']) . '</a>';
        echo '</div></div>';
        echo '</header>';
        return ob_get_clean();
    }

    public function render_footer_nav() {
        $s = $this->get_settings();
        $items = $this->decode_items($s['footer_items'], $this->default_footer_items());
        ob_start();
        echo '<footer class="og-global-footer" role="contentinfo">';
        echo '<div class="og-footer-inner">';
        echo '<div><div class="og-footer-brand">' . esc_html($s['brand_label']) . '</div><p>Persistent navigation, platform console access, forms bridge, verification records, tools, artifacts, and documentation pathways.</p></div>';
        echo '<div class="og-footer-links">';
        foreach ($items as $item) {
            $label = isset($item['label']) ? $item['label'] : '';
            $url = isset($item['url']) ? $item['url'] : '#';
            echo '<a href="' . esc_url(home_url($url)) . '">' . esc_html($label) . '</a>';
        }
        echo '</div></div>';
        echo '<div class="og-footer-bottom">ONEGODIAN, LLC · OMOS Platform Console · Persistent Global Navigation</div>';
        echo '</footer>';
        return ob_get_clean();
    }

    public function register_admin_menu() {
        add_submenu_page(
            'options-general.php',
            'OneGodian Global Navigation',
            'OneGodian Global Navigation',
            'manage_options',
            self::MENU_SLUG,
            array($this, 'settings_screen')
        );
    }

    public function settings_screen() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        if (isset($_POST['og_nav_save'])) {
            check_admin_referer('og_nav_save_settings');
            $settings = $this->get_settings();
            foreach ($settings as $key => $default) {
                if (isset($_POST[$key])) {
                    $settings[$key] = is_string($_POST[$key]) ? wp_kses_post(wp_unslash($_POST[$key])) : '';
                } elseif (in_array($key, array('auto_header', 'auto_footer', 'show_top_notice'), true)) {
                    $settings[$key] = '0';
                }
            }
            update_option(self::OPTION_SETTINGS, $settings, false);
            echo '<div class="notice notice-success"><p>Global navigation settings saved.</p></div>';
        }
        $s = $this->get_settings();
        echo '<div class="wrap"><h1>OneGodian Global Navigation</h1><p>Persistent navigation module for OneGodian and OMOS pages.</p><form method="post">';
        wp_nonce_field('og_nav_save_settings');
        echo '<table class="form-table">';
        echo '<tr><th>Brand Label</th><td><input class="regular-text" name="brand_label" value="' . esc_attr($s['brand_label']) . '"></td></tr>';
        echo '<tr><th>Brand Subtitle</th><td><input class="regular-text" name="brand_subtitle" value="' . esc_attr($s['brand_subtitle']) . '"></td></tr>';
        echo '<tr><th>Home URL</th><td><input class="regular-text" name="home_url" value="' . esc_attr($s['home_url']) . '"></td></tr>';
        echo '<tr><th>Console URL</th><td><input class="regular-text" name="console_url" value="' . esc_attr($s['console_url']) . '"></td></tr>';
        echo '<tr><th>CTA Label</th><td><input class="regular-text" name="cta_label" value="' . esc_attr($s['cta_label']) . '"></td></tr>';
        echo '<tr><th>Auto Header</th><td><label><input type="checkbox" name="auto_header" value="1" ' . checked($s['auto_header'], '1', false) . '> Inject global header after body open</label></td></tr>';
        echo '<tr><th>Auto Footer</th><td><label><input type="checkbox" name="auto_footer" value="1" ' . checked($s['auto_footer'], '1', false) . '> Inject global footer</label></td></tr>';
        echo '<tr><th>Show Top Notice</th><td><label><input type="checkbox" name="show_top_notice" value="1" ' . checked($s['show_top_notice'], '1', false) . '> Enabled</label></td></tr>';
        echo '<tr><th>Top Notice</th><td><textarea class="large-text" rows="3" name="top_notice">' . esc_textarea($s['top_notice']) . '</textarea></td></tr>';
        echo '<tr><th>Navigation JSON</th><td><textarea class="large-text code" rows="12" name="nav_items">' . esc_textarea($s['nav_items']) . '</textarea><p class="description">JSON array with label, url, and description.</p></td></tr>';
        echo '<tr><th>Footer JSON</th><td><textarea class="large-text code" rows="10" name="footer_items">' . esc_textarea($s['footer_items']) . '</textarea><p class="description">JSON array with label and url.</p></td></tr>';
        echo '</table>';
        submit_button('Save Navigation Settings', 'primary', 'og_nav_save');
        echo '</form>';
        echo '<h2>Shortcodes</h2><p><code>[onegodian_global_nav]</code> <code>[onegodian_global_footer]</code> <code>[onegodian_open_console_button]</code></p>';
        echo '</div>';
    }

    public function print_css() {
        echo '<style id="onegodian-global-navigation-css">
        .og-global-nav{position:sticky;top:0;z-index:9999;background:rgba(7,6,7,.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(216,179,90,.18);color:#f5f1e8;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.og-nav-notice{text-align:center;padding:8px 14px;background:linear-gradient(90deg,rgba(111,60,255,.18),rgba(216,179,90,.12));border-bottom:1px solid rgba(216,179,90,.14);font-size:12px;color:rgba(245,241,232,.82)}.og-nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:13px 18px}.og-nav-brand{display:flex;align-items:center;gap:12px;color:#f5f1e8;text-decoration:none;min-width:220px}.og-nav-brand strong{display:block;line-height:1;color:#f5f1e8;letter-spacing:.06em}.og-nav-brand small{display:block;color:#f0d98a;font-size:11px;margin-top:3px}.og-nav-mark{width:42px;height:42px;border-radius:14px;background:rgba(216,179,90,.12);border:1px solid rgba(216,179,90,.36);display:flex;align-items:center;justify-content:center;color:#f0d98a;font-weight:900}.og-nav-links{display:flex;align-items:center;gap:4px;flex:1;justify-content:center}.og-nav-link{display:block;text-decoration:none;color:rgba(245,241,232,.86);padding:9px 11px;border-radius:14px;transition:.2s ease}.og-nav-link:hover{background:rgba(216,179,90,.10);color:#f0d98a}.og-nav-link span{display:block;font-weight:800;font-size:13px}.og-nav-link small{display:block;font-size:10px;color:rgba(245,241,232,.52);line-height:1.2}.og-nav-actions{display:flex;align-items:center;gap:10px}.og-nav-cta,.og-mobile-cta{display:inline-block;text-decoration:none;background:#f0d98a;color:#070607!important;border-radius:999px;padding:10px 15px;font-weight:900;font-size:13px;box-shadow:0 12px 30px rgba(0,0,0,.24)}.og-mobile-toggle{display:none;border:1px solid rgba(216,179,90,.28);background:rgba(255,255,255,.04);color:#f5f1e8;border-radius:12px;padding:9px 12px;font-size:20px}.og-mobile-drawer{display:none;border-top:1px solid rgba(216,179,90,.14);background:#070607}.og-mobile-drawer-inner{display:grid;gap:8px;padding:14px 18px}.og-mobile-drawer a{color:#f5f1e8;text-decoration:none;padding:12px;border:1px solid rgba(216,179,90,.14);border-radius:14px;background:rgba(255,255,255,.035)}.og-global-footer{background:#070607;color:#f5f1e8;border-top:1px solid rgba(216,179,90,.18);padding:36px 18px 20px}.og-footer-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1.5fr;gap:28px}.og-footer-brand{color:#f0d98a;font-weight:900;font-size:20px;letter-spacing:.08em}.og-global-footer p{color:rgba(245,241,232,.72);line-height:1.7}.og-footer-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.og-footer-links a{color:rgba(245,241,232,.86);text-decoration:none;border:1px solid rgba(216,179,90,.14);background:rgba(255,255,255,.035);padding:11px 12px;border-radius:14px}.og-footer-links a:hover{color:#f0d98a;border-color:rgba(216,179,90,.32)}.og-footer-bottom{text-align:center;color:rgba(245,241,232,.52);font-size:12px;margin-top:24px;padding-top:18px;border-top:1px solid rgba(216,179,90,.10)}@media(max-width:1100px){.og-nav-links{display:none}.og-mobile-toggle{display:inline-block}.og-global-nav.is-open .og-mobile-drawer{display:block}.og-nav-brand{min-width:unset}.og-nav-brand small{display:none}}@media(max-width:720px){.og-nav-inner{padding:11px 12px}.og-nav-brand strong{font-size:13px}.og-nav-mark{width:38px;height:38px}.og-nav-cta{display:none}.og-footer-inner{grid-template-columns:1fr}.og-nav-notice{font-size:11px}}
        </style>';
    }

    public function print_js() {
        echo '<script id="onegodian-global-navigation-js">
        document.addEventListener("click",function(e){var btn=e.target.closest(".og-mobile-toggle");if(!btn)return;var nav=btn.closest(".og-global-nav");if(!nav)return;var open=nav.classList.toggle("is-open");btn.setAttribute("aria-expanded",open?"true":"false");var drawer=nav.querySelector(".og-mobile-drawer");if(drawer){drawer.setAttribute("aria-hidden",open?"false":"true");}});
        </script>';
    }
}

OneGodian_Global_Navigation::instance();
