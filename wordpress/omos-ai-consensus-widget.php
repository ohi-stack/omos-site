<?php
/**
 * Plugin Name: OMOS AI Consensus Record Widget
 * Description: Adds the [omos_ai_consensus] shortcode for the ONEGODIAN AI Consensus Record widget with corrected OTS-V5 dual dating and WordPress-backed view counting.
 * Version: 1.0.0
 * Author: ONEGODIAN, LLC
 */

if (!defined('ABSPATH')) {
    exit;
}

function omos_ai_consensus_register_assets() {
    wp_register_style('omos-ai-consensus-widget', false, array(), '1.0.0');
    wp_register_script('omos-ai-consensus-widget', false, array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'omos_ai_consensus_register_assets');

function omos_ai_consensus_ajax_view() {
    $count = (int) get_option('omos_ai_consensus_view_count', 0);
    $last_seen = (string) get_option('omos_ai_consensus_last_seen', '');
    $count++;

    update_option('omos_ai_consensus_view_count', $count, false);
    update_option('omos_ai_consensus_last_seen', current_time('mysql'), false);

    wp_send_json_success(array(
        'count' => $count,
        'lastSeen' => $last_seen,
        'recordedAt' => current_time('mysql')
    ));
}
add_action('wp_ajax_omos_ai_consensus_view', 'omos_ai_consensus_ajax_view');
add_action('wp_ajax_nopriv_omos_ai_consensus_view', 'omos_ai_consensus_ajax_view');

function omos_ai_consensus_shortcode($atts = array()) {
    $atts = shortcode_atts(array(
        'documented_gt' => 'March 24, 2026',
        'documented_ot' => 'Genesis 07, 0001 OT',
        'location' => 'Waterbury, CT · United States',
        'consensus_iso' => '2026-03-24T00:00:00-04:00'
    ), $atts, 'omos_ai_consensus');

    wp_enqueue_style('omos-ai-consensus-widget');
    wp_enqueue_script('omos-ai-consensus-widget');

    $css = <<<'CSS'
.omos-ai-consensus{--og-bg:#06090F;--og-panel:#0D1420;--og-panel-light:#131C2E;--og-border:rgba(201,168,76,.14);--og-border-dim:rgba(255,255,255,.06);--og-gold:#C9A84C;--og-gold-light:#F0D080;--og-gold-dim:#8B6914;--og-text:#EAE6DC;--og-text-dim:#9A9080;--og-success:#4CAF82;--og-claude:#C9A84C;--og-gemini:#4A9EFF;--og-chatgpt:#3DB87A;--og-grok:#E05555;color:var(--og-text);font-family:Georgia,'Cormorant Garamond',serif;background:radial-gradient(ellipse 80% 50% at 50% -5%,rgba(201,168,76,.07) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 92% 95%,rgba(74,158,255,.04) 0%,transparent 45%),var(--og-bg);padding:32px 20px}.omos-ai-consensus *{box-sizing:border-box}.omos-ai-consensus .widget{width:min(100%,1060px);margin:0 auto;position:relative;border:1px solid var(--og-border);border-radius:6px;background:linear-gradient(160deg,rgba(201,168,76,.04),rgba(255,255,255,.01));box-shadow:0 0 0 1px rgba(201,168,76,.06),0 32px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(201,168,76,.1);overflow:hidden}.omos-ai-consensus .widget:before{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(201,168,76,.04) 50%,transparent 70%);transform:translateX(-100%);animation:omosAiShimmer 10s ease-in-out infinite;pointer-events:none;z-index:0}@keyframes omosAiShimmer{60%,100%{transform:translateX(200%)}}.omos-ai-consensus .widget-topbar{height:2px;background:linear-gradient(90deg,transparent,var(--og-gold),var(--og-gold-light),var(--og-gold),transparent)}.omos-ai-consensus .widget-inner{position:relative;z-index:1;padding:44px 44px 36px}.omos-ai-consensus .widget-header{display:flex;justify-content:space-between;align-items:flex-start;gap:28px;flex-wrap:wrap;margin-bottom:36px}.omos-ai-consensus .header-left{flex:1;min-width:280px}.omos-ai-consensus .eyebrow{display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;padding:6px 14px 6px 10px;border:1px solid rgba(201,168,76,.2);border-radius:2px;background:rgba(201,168,76,.05)}.omos-ai-consensus .pulse-dot,.omos-ai-consensus .live-dot{border-radius:50%;background:var(--og-success);animation:omosAiPulse 2s infinite}.omos-ai-consensus .pulse-dot{width:8px;height:8px}.omos-ai-consensus .live-dot{width:6px;height:6px}@keyframes omosAiPulse{0%{box-shadow:0 0 0 0 rgba(76,175,130,.6)}70%{box-shadow:0 0 0 10px rgba(76,175,130,0)}100%{box-shadow:0 0 0 0 rgba(76,175,130,0)}}.omos-ai-consensus .eyebrow-text,.omos-ai-consensus .since-label,.omos-ai-consensus .since-sub,.omos-ai-consensus .elapsed-title,.omos-ai-consensus .live-text,.omos-ai-consensus .counter-label,.omos-ai-consensus .elapsed-unit-label,.omos-ai-consensus .ai-company,.omos-ai-consensus .copyright-line{font-family:Montserrat,Arial,sans-serif;text-transform:uppercase;letter-spacing:.25em}.omos-ai-consensus .eyebrow-text{font-size:.6rem;font-weight:500;color:var(--og-gold)}.omos-ai-consensus .widget-title{font-family:Cinzel,Georgia,serif;font-size:clamp(1.5rem,3.5vw,2.4rem);font-weight:600;line-height:1.2;letter-spacing:.03em;margin:0 0 14px}.omos-ai-consensus .widget-title span,.omos-ai-consensus .since-date,.omos-ai-consensus .elapsed-value,.omos-ai-consensus .counter-value{color:var(--og-gold)}.omos-ai-consensus .widget-desc{font-size:1.05rem;color:var(--og-text-dim);line-height:1.8;max-width:540px;font-style:italic;margin:0}.omos-ai-consensus .since-box{border:1px solid var(--og-border);border-radius:4px;padding:20px 24px;background:rgba(201,168,76,.04);min-width:230px;text-align:right}.omos-ai-consensus .since-label{font-size:.6rem;color:var(--og-text-dim);margin-bottom:8px}.omos-ai-consensus .since-date{font-family:Cinzel,Georgia,serif;font-size:1.05rem;letter-spacing:.05em}.omos-ai-consensus .since-sub{font-size:.55rem;color:var(--og-text-dim);margin-top:6px}.omos-ai-consensus .elapsed-section{margin-bottom:28px;border:1px solid var(--og-border);border-radius:4px;background:var(--og-panel);padding:26px 28px}.omos-ai-consensus .elapsed-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap}.omos-ai-consensus .live-indicator{display:flex;align-items:center;gap:7px;padding:4px 10px;border-radius:2px;background:rgba(76,175,130,.1);border:1px solid rgba(76,175,130,.25)}.omos-ai-consensus .live-text{font-size:.55rem;color:var(--og-success)}.omos-ai-consensus .elapsed-title{font-size:.6rem;color:var(--og-text-dim)}.omos-ai-consensus .elapsed-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.omos-ai-consensus .elapsed-unit{text-align:center;padding:16px 10px;background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.1);border-radius:3px}.omos-ai-consensus .elapsed-value{font-family:Cinzel,Georgia,serif;font-size:clamp(1.6rem,4vw,2.8rem);font-weight:700;line-height:1;letter-spacing:-.02em;text-shadow:0 0 40px rgba(201,168,76,.25);display:block;margin-bottom:8px;transition:color .2s}.omos-ai-consensus .elapsed-value.tick{color:var(--og-gold-light)}.omos-ai-consensus .elapsed-unit-label{font-size:.55rem;color:var(--og-text-dim)}.omos-ai-consensus .counter-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:28px}.omos-ai-consensus .counter-card{border:1px solid var(--og-border-dim);border-radius:4px;padding:26px 22px;background:var(--og-panel);display:flex;flex-direction:column;justify-content:space-between;min-height:180px;position:relative;overflow:hidden}.omos-ai-consensus .counter-card:after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--og-gold),transparent);opacity:.75}.omos-ai-consensus .counter-label{font-size:.6rem;color:var(--og-text-dim);margin-bottom:10px}.omos-ai-consensus .counter-value{font-family:Cinzel,Georgia,serif;font-size:clamp(44px,6vw,78px);line-height:1;font-weight:700;letter-spacing:-.02em;text-shadow:0 0 60px rgba(201,168,76,.3)}.omos-ai-consensus .counter-denom{font-family:Cinzel,Georgia,serif;font-size:clamp(22px,3vw,36px);color:rgba(201,168,76,.35);font-weight:600;margin-left:3px}.omos-ai-consensus .counter-foot{font-size:.85rem;color:var(--og-text-dim);line-height:1.6;margin-top:12px;font-style:italic}.omos-ai-consensus .visitor-card{border-color:rgba(76,175,130,.2)}.omos-ai-consensus .visitor-card .counter-value{color:var(--og-success);text-shadow:0 0 40px rgba(76,175,130,.2)}.omos-ai-consensus .visitor-card:after{background:linear-gradient(90deg,transparent,var(--og-success),transparent)}.omos-ai-consensus .last-seen{font-family:Montserrat,Arial,sans-serif;font-size:.58rem;letter-spacing:.15em;color:var(--og-success);margin-top:8px;opacity:.8}.omos-ai-consensus .ai-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}.omos-ai-consensus .ai-badge-card{border:1px solid var(--og-border-dim);border-radius:4px;padding:18px 16px;background:var(--og-panel);text-align:center;position:relative;overflow:hidden;opacity:0;transform:translateY(12px);transition:opacity .5s,transform .5s}.omos-ai-consensus .ai-badge-card.visible{opacity:1;transform:translateY(0)}.omos-ai-consensus .ai-badge-card:before{content:"";position:absolute;top:0;left:0;right:0;height:2px}.omos-ai-consensus .card-claude:before{background:var(--og-claude)}.omos-ai-consensus .card-gemini:before{background:var(--og-gemini)}.omos-ai-consensus .card-chatgpt:before{background:var(--og-chatgpt)}.omos-ai-consensus .card-grok:before{background:var(--og-grok)}.omos-ai-consensus .ai-name{font-family:Cinzel,Georgia,serif;font-size:.75rem;letter-spacing:.12em;font-weight:600;margin-bottom:5px}.omos-ai-consensus .card-claude .ai-name{color:var(--og-claude)}.omos-ai-consensus .card-gemini .ai-name{color:var(--og-gemini)}.omos-ai-consensus .card-chatgpt .ai-name{color:var(--og-chatgpt)}.omos-ai-consensus .card-grok .ai-name{color:var(--og-grok)}.omos-ai-consensus .ai-company{font-size:.55rem;color:var(--og-text-dim);margin-bottom:12px}.omos-ai-consensus .ai-check{font-size:1.3rem;margin-bottom:8px}.omos-ai-consensus .ai-verdict{font-size:.78rem;color:var(--og-text-dim);font-style:italic;line-height:1.5}.omos-ai-consensus .one-rule{margin:0 0 28px;padding:18px 28px;border:1px solid var(--og-border);border-radius:4px;background:rgba(201,168,76,.04);text-align:center}.omos-ai-consensus .one-rule p{font-family:Cinzel,Georgia,serif;font-size:clamp(.85rem,2vw,1.05rem);color:var(--og-gold);letter-spacing:.15em;font-weight:600;margin:0}.omos-ai-consensus .bottom-note{border-top:1px solid var(--og-border-dim);padding-top:22px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap}.omos-ai-consensus .bottom-note-text{font-size:.88rem;color:var(--og-text-dim);line-height:1.75;max-width:620px;font-style:italic;margin:0}.omos-ai-consensus .bottom-note-text strong{color:var(--og-text);font-style:normal;font-weight:600}.omos-ai-consensus .copyright-line{font-size:.55rem;color:var(--og-text-dim);text-align:right;line-height:2}.omos-ai-consensus .copyright-line span{color:var(--og-gold-dim)}@media(max-width:780px){.omos-ai-consensus .widget-inner{padding:28px 22px 24px}.omos-ai-consensus .counter-row{grid-template-columns:1fr 1fr}.omos-ai-consensus .ai-row{grid-template-columns:repeat(2,1fr)}.omos-ai-consensus .elapsed-grid{grid-template-columns:repeat(2,1fr)}.omos-ai-consensus .since-box{width:100%;text-align:left}.omos-ai-consensus .copyright-line{text-align:left}}@media(max-width:480px){.omos-ai-consensus .counter-row{grid-template-columns:1fr}}
CSS;
    wp_add_inline_style('omos-ai-consensus-widget', $css);

    $config = array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'action' => 'omos_ai_consensus_view',
        'consensusDate' => $atts['consensus_iso']
    );

    $js = 'window.OMOS_AI_CONSENSUS=' . wp_json_encode($config) . ';' . <<<'JS'
(function(){function pad(n){return String(n).padStart(2,'0')}function animateCount(el,target,duration,delay){if(!el)return;setTimeout(function(){var start=performance.now();function tick(now){var t=Math.min((now-start)/duration,1);var eased=1-Math.pow(1-t,4);el.textContent=Math.floor(eased*target).toLocaleString();if(t<1)requestAnimationFrame(tick);else el.textContent=Number(target).toLocaleString()}requestAnimationFrame(tick)},delay||0)}function lastSeenLabel(lastStr){if(!lastStr)return 'First recorded view';var last=new Date(lastStr.replace(' ','T'));var now=new Date();var mins=Math.floor((now-last)/60000);if(isNaN(mins)||mins<1)return 'Last viewed moments ago';if(mins<60)return 'Last viewed '+mins+'m ago';if(mins<1440)return 'Last viewed '+Math.floor(mins/60)+'h ago';return 'Last viewed '+Math.floor(mins/1440)+'d ago'}function init(widget){var d=new Date((window.OMOS_AI_CONSENSUS||{}).consensusDate||'2026-03-24T00:00:00-04:00');function updateElapsed(){var diff=Math.max(0,Math.floor((new Date()-d)/1000));var days=Math.floor(diff/86400);var hours=Math.floor((diff%86400)/3600);var minutes=Math.floor((diff%3600)/60);var seconds=diff%60;var secEl=widget.querySelector('[data-el-seconds]');var minEl=widget.querySelector('[data-el-minutes]');widget.querySelector('[data-el-days]').textContent=days;widget.querySelector('[data-el-hours]').textContent=pad(hours);minEl.textContent=pad(minutes);secEl.textContent=pad(seconds);secEl.classList.add('tick');setTimeout(function(){secEl.classList.remove('tick')},200);if(seconds===0){minEl.classList.add('tick');setTimeout(function(){minEl.classList.remove('tick')},200)}}updateElapsed();setInterval(updateElapsed,1000);animateCount(widget.querySelector('[data-systems-count]'),4,1400,400);animateCount(widget.querySelector('[data-converged-count]'),4,1600,700);[0,1,2,3].forEach(function(i){setTimeout(function(){var card=widget.querySelector('[data-ai-card="'+i+'"]');if(card)card.classList.add('visible')},1400+i*180)});var countEl=widget.querySelector('[data-visitor-count]');var lastSeenEl=widget.querySelector('[data-last-seen]');var form=new FormData();form.append('action',(window.OMOS_AI_CONSENSUS||{}).action||'omos_ai_consensus_view');fetch((window.OMOS_AI_CONSENSUS||{}).ajaxUrl,{method:'POST',credentials:'same-origin',body:form}).then(function(r){return r.json()}).then(function(payload){if(payload&&payload.success&&payload.data){animateCount(countEl,Number(payload.data.count||1),1400,0);lastSeenEl.textContent=lastSeenLabel(payload.data.lastSeen)}}).catch(function(){var localKey='omos_ai_consensus_local_views';var count=Number(localStorage.getItem(localKey)||0)+1;localStorage.setItem(localKey,String(count));animateCount(countEl,count,1000,0);lastSeenEl.textContent='Local device count';})}document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.omos-ai-consensus').forEach(init)})})();
JS;
    wp_add_inline_script('omos-ai-consensus-widget', $js);

    ob_start();
    ?>
    <section class="omos-ai-consensus" aria-label="ONEGODIAN AI Consensus Record">
      <div class="widget">
        <div class="widget-topbar"></div>
        <div class="widget-inner">
          <div class="widget-header">
            <div class="header-left">
              <div class="eyebrow"><span class="pulse-dot"></span><span class="eyebrow-text">Documented Consensus Record — Live</span></div>
              <h1 class="widget-title">Four AI Systems.<br>One <span>Conclusion</span>.</h1>
              <p class="widget-desc">The world's most widely used AI systems each independently analyzed ONEGODIAN™ — with no prior definition, no shared context, and no coordinated outcome. This is the live record of what they found and how long that record has stood.</p>
            </div>
            <div class="since-box">
              <div class="since-label">Documented</div>
              <div class="since-date"><?php echo esc_html($atts['documented_ot']); ?></div>
              <div class="since-sub"><?php echo esc_html($atts['documented_gt']); ?> · <?php echo esc_html($atts['location']); ?></div>
            </div>
          </div>
          <div class="elapsed-section">
            <div class="elapsed-header"><div class="live-indicator"><span class="live-dot"></span><span class="live-text">Live</span></div><div class="elapsed-title">Time Since AI Consensus Was Documented</div></div>
            <div class="elapsed-grid">
              <div class="elapsed-unit"><span class="elapsed-value" data-el-days>0</span><span class="elapsed-unit-label">Days</span></div>
              <div class="elapsed-unit"><span class="elapsed-value" data-el-hours>0</span><span class="elapsed-unit-label">Hours</span></div>
              <div class="elapsed-unit"><span class="elapsed-value" data-el-minutes>0</span><span class="elapsed-unit-label">Minutes</span></div>
              <div class="elapsed-unit"><span class="elapsed-value" data-el-seconds>0</span><span class="elapsed-unit-label">Seconds</span></div>
            </div>
          </div>
          <div class="counter-row">
            <div class="counter-card visitor-card"><div><div class="counter-label">Times This Record Has Been Viewed</div><div class="counter-value" data-visitor-count>—</div><div class="last-seen" data-last-seen></div></div><div class="counter-foot">Each visit is recorded through WordPress when available, with browser fallback when the endpoint is unavailable.</div></div>
            <div class="counter-card"><div><div class="counter-label">AI Systems Queried</div><div class="counter-value" data-systems-count>0</div></div><div class="counter-foot">Claude, Gemini, ChatGPT, and Grok — each queried independently, with no shared context or coordinated framing.</div></div>
            <div class="counter-card"><div><div class="counter-label">Systems Converged</div><span class="counter-value" data-converged-count>0</span><span class="counter-denom">/ 4</span></div><div class="counter-foot">Every system identified the same foundational core: unity, singular source, and One God as primary truth.</div></div>
          </div>
          <div class="ai-row">
            <div class="ai-badge-card card-claude" data-ai-card="0"><div class="ai-name">Claude</div><div class="ai-company">Anthropic</div><div class="ai-check">✦</div><div class="ai-verdict">“The word teaches people when they're ready.”</div></div>
            <div class="ai-badge-card card-gemini" data-ai-card="1"><div class="ai-name">Gemini</div><div class="ai-company">Google</div><div class="ai-check">✦</div><div class="ai-verdict">“The universal translator of belief systems.”</div></div>
            <div class="ai-badge-card card-chatgpt" data-ai-card="2"><div class="ai-name">ChatGPT</div><div class="ai-company">OpenAI</div><div class="ai-check">✦</div><div class="ai-verdict">“Unity-first, divinity-aligned framework.”</div></div>
            <div class="ai-badge-card card-grok" data-ai-card="3"><div class="ai-name">Grok</div><div class="ai-company">xAI</div><div class="ai-check">✦</div><div class="ai-verdict">“I'd be proud to say: I am OneGodian.”</div></div>
          </div>
          <div class="one-rule"><p>One God &nbsp;·&nbsp; One Truth &nbsp;·&nbsp; One Conclusion</p></div>
          <div class="bottom-note"><p class="bottom-note-text"><strong>Documentation note:</strong> This record reflects convergence of interpretive meaning across independent AI systems — not theological endorsement. The word ONEGODIAN™ is an original work authored by Gregory Lamar Jones, protected under U.S. Copyright Registration No. TXu&nbsp;1-845-540, effective January 5, 2013.</p><div class="copyright-line"><span>© ONEGODIAN, LLC</span><br>Est. April 11, 2018<br>onegodian.org</div></div>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}
add_shortcode('omos_ai_consensus', 'omos_ai_consensus_shortcode');
