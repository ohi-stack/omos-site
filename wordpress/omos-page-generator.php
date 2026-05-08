<?php
/**
 * Plugin Name: OMOS Page Generator
 * Description: Creates and repairs the OMOS master page structure with shortcode placeholders, nested page support, and mobile-responsive wrapper markup.
 * Version: 1.1.0
 * Author: ONEGODIAN, LLC
 */

if (!defined('ABSPATH')) {
    exit;
}

function omos_required_pages_manifest() {
    return array(
        array('title'=>'Home','path'=>'home','shortcode'=>'[omos_home]','description'=>'Main OMOS landing page.'),
        array('title'=>'OMOS','path'=>'omos','shortcode'=>'[omos_overview]','description'=>'OMOS overview and platform explanation.'),
        array('title'=>'OMOS Overview','path'=>'omos/overview','shortcode'=>'[omos_overview]','description'=>'Overview of OMOS structure and purpose.'),
        array('title'=>'What Is OMOS?','path'=>'omos/what-is-omos','shortcode'=>'[omos_explainer]','description'=>'Plain-language OMOS explanation.'),
        array('title'=>'OneGodian Algorithm','path'=>'omos/onegodian-algorithm','shortcode'=>'[omos_algorithm]','description'=>'OneGodian Algorithm overview.'),
        array('title'=>'OMOS Protocol','path'=>'omos/protocol','shortcode'=>'[omos_protocol_spec]','description'=>'OMOS protocol specification.'),
        array('title'=>'OMOS Timekeeping','path'=>'omos/timekeeping','shortcode'=>'[omos_timekeeping]','description'=>'OTS-V5 timekeeping overview.'),
        array('title'=>'OHI','path'=>'ohi','shortcode'=>'[omos_ohi]','description'=>'OHI overview.'),
        array('title'=>'OHI Overview','path'=>'ohi/overview','shortcode'=>'[omos_ohi_overview]','description'=>'OHI overview page.'),
        array('title'=>'OHI Reasoning Layer','path'=>'ohi/reasoning-layer','shortcode'=>'[omos_ohi_reasoning]','description'=>'OHI reasoning layer.'),
        array('title'=>'OHI Output Pipeline','path'=>'ohi/output-pipeline','shortcode'=>'[omos_ohi_output_pipeline]','description'=>'OHI output pipeline.'),
        array('title'=>'OHI Runtime','path'=>'ohi/runtime','shortcode'=>'[omos_ohi_runtime]','description'=>'OHI runtime specification.'),
        array('title'=>'OHI Reports','path'=>'ohi/reports','shortcode'=>'[omos_ohi_reports]','description'=>'OHI reports archive.'),
        array('title'=>'OHI Specification','path'=>'ohi/specification','shortcode'=>'[omos_ohi_specification]','description'=>'OHI specification.'),
        array('title'=>'Models','path'=>'models','shortcode'=>'[omos_models]','description'=>'Models overview.'),
        array('title'=>'Council of Models','path'=>'models/council-of-models','shortcode'=>'[omos_council_models]','description'=>'Council of Models page.'),
        array('title'=>'Model Synthesis','path'=>'models/model-synthesis','shortcode'=>'[omos_model_synthesis]','description'=>'Model synthesis overview.'),
        array('title'=>'GCD Model Synthesis','path'=>'models/gcd-model-synthesis','shortcode'=>'[omos_gcd_synthesis]','description'=>'Algorithmic GCD synthesis.'),
        array('title'=>'Model Comparison','path'=>'models/model-comparison','shortcode'=>'[omos_model_comparison]','description'=>'Model comparison page.'),
        array('title'=>'Model Governance','path'=>'models/governance','shortcode'=>'[omos_model_governance]','description'=>'Model governance page.'),
        array('title'=>'Tools','path'=>'tools','shortcode'=>'[omos_tools]','description'=>'Interactive tools overview.'),
        array('title'=>'Declaration Generator','path'=>'tools/declaration-generator','shortcode'=>'[omos_declaration_generator]','description'=>'Generate a OneGodian declaration artifact.'),
        array('title'=>'Belief Mapper','path'=>'tools/belief-mapper','shortcode'=>'[omos_belief_mapper]','description'=>'Belief Mapper tool.'),
        array('title'=>'Time Converter','path'=>'tools/time-converter','shortcode'=>'[omos_time_converter]','description'=>'OneGodian Time converter.'),
        array('title'=>'OHI Output Pipeline Tool','path'=>'tools/ohi-output-pipeline','shortcode'=>'[omos_ohi_output_pipeline]','description'=>'Interactive OHI pipeline.'),
        array('title'=>'Obsidian Seal Generator','path'=>'tools/obsidian-seal-generator','shortcode'=>'[omos_obsidian_seal_generator]','description'=>'Obsidian Seal generator.'),
        array('title'=>'AI System Prompt Tool','path'=>'tools/ai-system-prompt','shortcode'=>'[omos_ai_system_prompt]','description'=>'AI system prompt page.'),
        array('title'=>'How OMOS Works in AI','path'=>'tools/how-omos-works-in-ai','shortcode'=>'[omos_how_ai]','description'=>'AI explanation tool page.'),
        array('title'=>'Artifacts','path'=>'artifacts','shortcode'=>'[omos_artifacts]','description'=>'Artifact library.'),
        array('title'=>'Declarations','path'=>'artifacts/declarations','shortcode'=>'[omos_artifact_declarations]','description'=>'Declaration artifacts.'),
        array('title'=>'Cards','path'=>'artifacts/cards','shortcode'=>'[omos_artifact_cards]','description'=>'Identity card artifacts.'),
        array('title'=>'Certificates','path'=>'artifacts/certificates','shortcode'=>'[omos_artifact_certificates]','description'=>'Certificate artifacts.'),
        array('title'=>'Whitepapers','path'=>'artifacts/whitepapers','shortcode'=>'[omos_artifact_whitepapers]','description'=>'Whitepaper artifacts.'),
        array('title'=>'Reports','path'=>'artifacts/reports','shortcode'=>'[omos_artifact_reports]','description'=>'Report artifacts.'),
        array('title'=>'Diagrams','path'=>'artifacts/diagrams','shortcode'=>'[omos_artifact_diagrams]','description'=>'Architecture diagrams.'),
        array('title'=>'Animations','path'=>'artifacts/animations','shortcode'=>'[omos_artifact_animations]','description'=>'Animation artifacts.'),
        array('title'=>'Downloads','path'=>'artifacts/downloads','shortcode'=>'[omos_artifact_downloads]','description'=>'Download library.'),
        array('title'=>'OHI Reports Artifact Archive','path'=>'artifacts/ohi-reports','shortcode'=>'[omos_artifact_ohi_reports]','description'=>'OHI report artifacts.'),
        array('title'=>'AI Consensus Archive','path'=>'artifacts/ai-consensus','shortcode'=>'[omos_ai_consensus]','description'=>'AI consensus artifacts.'),
        array('title'=>'Founder Records','path'=>'artifacts/founder-records','shortcode'=>'[omos_founder_records]','description'=>'Founder record artifacts.'),
        array('title'=>'Verification Records','path'=>'artifacts/verification-records','shortcode'=>'[omos_verification_records]','description'=>'Verification record archive.'),
        array('title'=>'Docs','path'=>'docs','shortcode'=>'[omos_docs]','description'=>'Documentation hub.'),
        array('title'=>'Getting Started','path'=>'docs/getting-started','shortcode'=>'[omos_docs_getting_started]','description'=>'Getting started docs.'),
        array('title'=>'OMOS Architecture','path'=>'docs/architecture','shortcode'=>'[omos_docs_architecture]','description'=>'Architecture documentation.'),
        array('title'=>'Protocol Docs','path'=>'docs/protocol','shortcode'=>'[omos_docs_protocol]','description'=>'Protocol docs.'),
        array('title'=>'Algorithm Docs','path'=>'docs/algorithm','shortcode'=>'[omos_docs_algorithm]','description'=>'Algorithm docs.'),
        array('title'=>'OHI Runtime Docs','path'=>'docs/ohi-runtime','shortcode'=>'[omos_docs_ohi_runtime]','description'=>'OHI runtime docs.'),
        array('title'=>'AI System Prompt Docs','path'=>'docs/ai-system-prompt','shortcode'=>'[omos_docs_ai_system_prompt]','description'=>'AI system prompt docs.'),
        array('title'=>'OTS-V5 Docs','path'=>'docs/ots-v5','shortcode'=>'[omos_docs_ots_v5]','description'=>'OTS-V5 docs.'),
        array('title'=>'Agent Authority Docs','path'=>'docs/agent-authority','shortcode'=>'[omos_docs_agent_authority]','description'=>'Agent authority docs.'),
        array('title'=>'Developer Docs','path'=>'docs/developer','shortcode'=>'[omos_developer_docs]','description'=>'Developer docs.'),
        array('title'=>'API Reference','path'=>'docs/api-reference','shortcode'=>'[omos_api_reference]','description'=>'API reference.'),
        array('title'=>'Implementation Notes','path'=>'docs/implementation-notes','shortcode'=>'[omos_implementation_notes]','description'=>'Implementation notes.'),
        array('title'=>'Shop','path'=>'shop','shortcode'=>'[omos_shop]','description'=>'OMOS shop.'),
        array('title'=>'Digital Products','path'=>'shop/digital-products','shortcode'=>'[omos_shop_digital_products]','description'=>'Digital product catalog.'),
        array('title'=>'Declaration Card','path'=>'shop/declaration-card','shortcode'=>'[omos_shop_declaration_card]','description'=>'Declaration card product.'),
        array('title'=>'Alignment Prompt','path'=>'shop/onegodian-alignment-prompt','shortcode'=>'[omos_shop_alignment_prompt]','description'=>'Alignment Prompt product.'),
        array('title'=>'Developer Kit','path'=>'shop/developer-kit','shortcode'=>'[omos_shop_developer_kit]','description'=>'Developer Kit product.'),
        array('title'=>'Algorithm PDF','path'=>'shop/algorithm-pdf','shortcode'=>'[omos_shop_algorithm_pdf]','description'=>'Algorithm PDF product.'),
        array('title'=>'Obsidian Seal','path'=>'shop/obsidian-seal','shortcode'=>'[omos_shop_obsidian_seal]','description'=>'Obsidian Seal product.'),
        array('title'=>'Frequency Standard Audio','path'=>'shop/frequency-standard-audio','shortcode'=>'[omos_shop_frequency_audio]','description'=>'Frequency audio product.'),
        array('title'=>'Bundles','path'=>'shop/bundles','shortcode'=>'[omos_shop_bundles]','description'=>'Shop bundles.'),
        array('title'=>'Latest News','path'=>'latest-news','shortcode'=>'[omos_latest_news]','description'=>'Latest news archive.'),
        array('title'=>'OMOS Updates','path'=>'latest-news/omos-updates','shortcode'=>'[omos_news_omos_updates]','description'=>'OMOS updates.'),
        array('title'=>'OHI Reports News','path'=>'latest-news/ohi-reports','shortcode'=>'[omos_news_ohi_reports]','description'=>'OHI reports news.'),
        array('title'=>'Development Notes','path'=>'latest-news/development-notes','shortcode'=>'[omos_news_development_notes]','description'=>'Development notes.'),
        array('title'=>'Product Updates','path'=>'latest-news/product-updates','shortcode'=>'[omos_news_product_updates]','description'=>'Product updates.'),
        array('title'=>'Institutional Notes','path'=>'latest-news/institutional-notes','shortcode'=>'[omos_news_institutional_notes]','description'=>'Institutional notes.'),
        array('title'=>'Dashboard','path'=>'dashboard','shortcode'=>'[omos_dashboard]','description'=>'OMOS dashboard.'),
        array('title'=>'Console Overview','path'=>'dashboard/overview','shortcode'=>'[omos_dashboard_overview]','description'=>'Console overview.'),
        array('title'=>'My Declarations','path'=>'dashboard/my-declarations','shortcode'=>'[omos_declaration_history]','description'=>'User declaration history.'),
        array('title'=>'My Tools','path'=>'dashboard/tools','shortcode'=>'[omos_dashboard_tools]','description'=>'Dashboard tools.'),
        array('title'=>'My Downloads','path'=>'dashboard/downloads','shortcode'=>'[omos_dashboard_downloads]','description'=>'Dashboard downloads.'),
        array('title'=>'API Keys','path'=>'dashboard/api-keys','shortcode'=>'[omos_dashboard_api_keys]','description'=>'API keys page.'),
        array('title'=>'Usage','path'=>'dashboard/usage','shortcode'=>'[omos_dashboard_usage]','description'=>'Usage dashboard.'),
        array('title'=>'Settings','path'=>'dashboard/settings','shortcode'=>'[omos_dashboard_settings]','description'=>'Dashboard settings.'),
        array('title'=>'Admin','path'=>'admin','shortcode'=>'[omos_admin]','description'=>'Admin overview.'),
        array('title'=>'App Bridge','path'=>'admin/app-bridge','shortcode'=>'[omos_admin_app_bridge]','description'=>'App Bridge settings.'),
        array('title'=>'Admin Tools','path'=>'admin/tools','shortcode'=>'[omos_admin_tools]','description'=>'Admin tools.'),
        array('title'=>'Production Checklist','path'=>'admin/production-checklist','shortcode'=>'[omos_admin_production_checklist]','description'=>'Production checklist.'),
        array('title'=>'Legal','path'=>'legal','shortcode'=>'[omos_legal]','description'=>'Legal hub.'),
        array('title'=>'Terms of Use','path'=>'legal/terms','shortcode'=>'[omos_terms]','description'=>'Terms of Use.'),
        array('title'=>'Privacy Policy','path'=>'legal/privacy','shortcode'=>'[omos_privacy]','description'=>'Privacy Policy.'),
        array('title'=>'Disclaimers','path'=>'legal/disclaimers','shortcode'=>'[omos_disclaimers]','description'=>'Disclaimers.'),
        array('title'=>'IP Notice','path'=>'legal/ip-notice','shortcode'=>'[omos_ip_notice]','description'=>'IP notice.'),
        array('title'=>'Classification Notice','path'=>'legal/classification-notice','shortcode'=>'[omos_classification_notice]','description'=>'Classification notice.'),
        array('title'=>'Commercial Notice','path'=>'legal/commercial-notice','shortcode'=>'[omos_commercial_notice]','description'=>'Commercial notice.'),
        array('title'=>'Accessibility','path'=>'legal/accessibility','shortcode'=>'[omos_accessibility]','description'=>'Accessibility page.'),
        array('title'=>'Contact','path'=>'contact','shortcode'=>'[omos_contact]','description'=>'Contact, support, licensing, and implementation inquiries.')
    );
}

function omos_title_from_slug($slug) {
    return ucwords(str_replace('-', ' ', sanitize_title($slug)));
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

function omos_find_child_page($slug, $parent_id = 0) {
    $query = new WP_Query(array(
        'post_type' => 'page',
        'name' => sanitize_title($slug),
        'post_parent' => (int) $parent_id,
        'post_status' => array('publish', 'draft', 'private'),
        'posts_per_page' => 1,
        'fields' => 'ids'
    ));

    return !empty($query->posts) ? (int) $query->posts[0] : 0;
}

function omos_ensure_page_path($path, $title, $content, $description, $shortcode) {
    $segments = array_values(array_filter(explode('/', trim($path, '/'))));
    $parent_id = 0;
    $created = array();
    $updated = array();
    $skipped = array();

    foreach ($segments as $index => $segment) {
        $is_leaf = ($index === count($segments) - 1);
        $slug = sanitize_title($segment);
        $page_id = omos_find_child_page($slug, $parent_id);

        if (!$page_id) {
            $page_id = wp_insert_post(array(
                'post_title' => $is_leaf ? $title : omos_title_from_slug($slug),
                'post_name' => $slug,
                'post_parent' => $parent_id,
                'post_type' => 'page',
                'post_status' => 'publish',
                'post_content' => $is_leaf ? $content : omos_page_content_template('[omos_section_index]', 'OMOS section index.'),
                'comment_status' => 'closed',
                'ping_status' => 'closed'
            ));

            if (!is_wp_error($page_id) && $page_id) {
                $created[] = implode('/', array_slice($segments, 0, $index + 1));
            }
        } elseif ($is_leaf) {
            $existing_content = (string) get_post_field('post_content', $page_id);
            if (strpos($existing_content, $shortcode) === false) {
                wp_update_post(array(
                    'ID' => $page_id,
                    'post_title' => $title,
                    'post_content' => $content,
                    'post_status' => 'publish'
                ));
                $updated[] = $path;
            } else {
                $skipped[] = $path;
            }
        }

        if ($page_id && !is_wp_error($page_id)) {
            update_post_meta($page_id, '_omos_generated_page', '1');
            if ($is_leaf) {
                update_post_meta($page_id, '_omos_shortcode', $shortcode);
                update_post_meta($page_id, '_omos_master_path', $path);
                update_post_meta($page_id, '_omos_page_description', $description);
            }
            $parent_id = (int) $page_id;
        }
    }

    return array('created'=>$created,'updated'=>$updated,'skipped'=>$skipped);
}

function omos_generate_required_pages() {
    if (!current_user_can('manage_options')) {
        return new WP_Error('omos_forbidden', 'Only administrators can generate OMOS pages.');
    }

    $result = array('created'=>array(), 'updated'=>array(), 'skipped'=>array());

    foreach (omos_required_pages_manifest() as $page) {
        $path = $page['path'];
        $content = omos_page_content_template($page['shortcode'], $page['description']);
        $page_result = omos_ensure_page_path($path, $page['title'], $content, $page['description'], $page['shortcode']);
        $result['created'] = array_merge($result['created'], $page_result['created']);
        $result['updated'] = array_merge($result['updated'], $page_result['updated']);
        $result['skipped'] = array_merge($result['skipped'], $page_result['skipped']);
    }

    $result['created'] = array_values(array_unique($result['created']));
    $result['updated'] = array_values(array_unique($result['updated']));
    $result['skipped'] = array_values(array_unique($result['skipped']));
    $result['count'] = count(omos_required_pages_manifest());

    return $result;
}

function omos_register_page_generator_admin() {
    add_submenu_page('tools.php','OMOS Page Generator','OMOS Page Generator','manage_options','omos-page-generator','omos_page_generator_admin_screen');
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
    echo '<p>Version 1.1.0 creates or repairs the OMOS master sitemap pages, nested route structure, shortcode placeholders, and mobile-responsive wrapper markup.</p>';
    echo '<p><strong>Manifest count:</strong> ' . esc_html(count(omos_required_pages_manifest())) . ' pages.</p>';

    if ($result && !is_wp_error($result)) {
        echo '<div class="notice notice-success"><p><strong>OMOS pages processed.</strong></p>';
        echo '<p>Total manifest pages: ' . esc_html($result['count']) . '</p>';
        echo '<p>Created: ' . esc_html(implode(', ', array_slice($result['created'], 0, 30))) . (count($result['created']) > 30 ? ' ...' : '') . '</p>';
        echo '<p>Updated: ' . esc_html(implode(', ', array_slice($result['updated'], 0, 30))) . (count($result['updated']) > 30 ? ' ...' : '') . '</p>';
        echo '<p>Skipped: ' . esc_html(count($result['skipped'])) . ' already synced.</p></div>';
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
