<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Read-through compatibility adapter for OneGodian Members / INO Platform.
 *
 * OMOS does not create or own membership records. WordPress/WooCommerce and
 * the active Members/INO plugin remain the source of truth for member state,
 * checkout, certificates, protected resources, and related records.
 */
final class OMOS_Members_Bridge {
    const SOURCE_OF_TRUTH = 'OneGodian Members / INO Platform + WordPress/WooCommerce';

    private $capability_tags = array(
        'member_dashboard'      => array('onegodian_member_dashboard'),
        'membership_cta'        => array('onegodian_membership_cta'),
        'pricing'               => array('onegodian_members_pricing', 'onegodian_pricing'),
        'resources'             => array('onegodian_membership_resources'),
        'certificates'          => array('onegodian_member_certificates'),
        'support'               => array('onegodian_member_support'),
        'ino_platform_overview' => array('ino_platform_overview'),
    );

    public function is_available() {
        return defined('OGM_VERSION')
            || class_exists('OneGodian_Members_Contributors_Affiliates')
            || shortcode_exists('onegodian_member_dashboard')
            || shortcode_exists('ino_platform_overview');
    }

    public function version() {
        return defined('OGM_VERSION') ? (string) OGM_VERSION : null;
    }

    private function first_available_shortcode($tags) {
        foreach ((array) $tags as $tag) {
            if (shortcode_exists($tag)) {
                return $tag;
            }
        }
        return null;
    }

    public function capabilities() {
        $capabilities = array();
        foreach ($this->capability_tags as $name => $tags) {
            $tag = $this->first_available_shortcode($tags);
            $capabilities[$name] = array(
                'available' => null !== $tag,
                'shortcode' => $tag,
            );
        }
        return $capabilities;
    }

    public function public_status() {
        $capabilities = $this->capabilities();
        $available = $this->is_available();
        $mode = 'not-detected';

        if ($available && !empty($capabilities['ino_platform_overview']['available'])) {
            $mode = 'ino-platform-compatible';
        } elseif ($available) {
            $mode = 'onegodian-members-compatible';
        }

        return array(
            'available'       => $available,
            'plugin_family'   => 'OneGodian Members / INO Platform',
            'version'         => $this->version(),
            'mode'            => $mode,
            'capabilities'    => $capabilities,
            'source_of_truth' => self::SOURCE_OF_TRUTH,
            'authority'       => 'read-through-compatibility-adapter',
        );
    }

    public function member_context() {
        if (!is_user_logged_in()) {
            return array(
                'logged_in' => false,
                'user'      => null,
            );
        }

        $user = wp_get_current_user();
        return array(
            'logged_in' => true,
            'user'      => array(
                'id'           => (int) $user->ID,
                'display_name' => (string) $user->display_name,
                'roles'        => array_values((array) $user->roles),
            ),
        );
    }

    public function authenticated_payload() {
        return array(
            'integration' => $this->public_status(),
            'member'      => $this->member_context(),
            'links'       => array(
                'members'     => home_url('/members/'),
                'memberships' => home_url('/product-category/memberships/'),
            ),
            'generated_at' => gmdate('c'),
        );
    }

    public function render_member_portal() {
        if (!$this->is_available()) {
            return '<div class="omos-core-notice">OneGodian Members / INO Platform is not active on this WordPress node. OMOS has not created a substitute member record.</div>';
        }

        if (!is_user_logged_in()) {
            $login_url = wp_login_url(home_url('/members/'));
            $body = '<p class="omos-core-notice">Sign in to open the member workspace.</p><p><a class="omos-core-button omos-core-button-primary" href="' . esc_url($login_url) . '">Sign In</a></p>';
            $cta = $this->first_available_shortcode($this->capability_tags['membership_cta']);
            if ($cta) {
                $body .= do_shortcode('[' . $cta . ']');
            }
            return $body;
        }

        $dashboard = $this->first_available_shortcode($this->capability_tags['member_dashboard']);
        if ($dashboard) {
            return do_shortcode('[' . $dashboard . ']');
        }

        return '<div class="omos-core-notice">The Members / INO Platform plugin is active, but its member dashboard surface is not registered on this node.</div>';
    }
}
