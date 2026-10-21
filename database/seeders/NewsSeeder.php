<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleAiMeta;
use App\Models\ArticleRevision;
use App\Models\ArticleSeo;
use App\Models\AuthorProfile;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Staff & Authors
        $admin = User::firstOrCreate(
            ['email' => 'admin@newsportal.local'],
            [
                'name' => 'Chief Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        $editor = User::firstOrCreate(
            ['email' => 'editor@newsportal.local'],
            [
                'name' => 'Elena Rostova',
                'password' => Hash::make('password'),
                'role' => 'chief_editor',
                'email_verified_at' => now(),
            ]
        );

        $authorMarcus = User::firstOrCreate(
            ['email' => 'marcus.vance@newsportal.local'],
            [
                'name' => 'Marcus Vance',
                'password' => Hash::make('password'),
                'role' => 'author',
                'email_verified_at' => now(),
            ]
        );

        $authorSarah = User::firstOrCreate(
            ['email' => 'sarah.jenkins@newsportal.local'],
            [
                'name' => 'Sarah Jenkins',
                'password' => Hash::make('password'),
                'role' => 'author',
                'email_verified_at' => now(),
            ]
        );

        $authorDavid = User::firstOrCreate(
            ['email' => 'david.kigozi@newsportal.local'],
            [
                'name' => 'David Kigozi',
                'password' => Hash::make('password'),
                'role' => 'author',
                'email_verified_at' => now(),
            ]
        );

        // Author Profiles
        AuthorProfile::updateOrCreate(
            ['user_id' => $editor->id],
            [
                'slug' => 'elena-rostova',
                'bio' => 'Elena is the Editor-in-Chief with over 15 years investigating international climate policy, sustainable technologies, and global treaties.',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'credentials' => 'Editor-in-Chief · Former Foreign Correspondent',
                'beat' => 'Global Policy & Climate',
                'social_links' => ['twitter' => 'https://x.com/erostova', 'linkedin' => 'https://linkedin.com'],
                'is_verified' => true,
            ]
        );

        AuthorProfile::updateOrCreate(
            ['user_id' => $authorMarcus->id],
            [
                'slug' => 'marcus-vance',
                'bio' => 'Marcus covers frontier artificial intelligence, semiconductor geopolitics, and emerging algorithmic regulation.',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'credentials' => 'Senior Technology Reporter',
                'beat' => 'Frontier Computing & AI Ethics',
                'social_links' => ['twitter' => 'https://x.com/marcusvance', 'github' => 'https://github.com'],
                'is_verified' => true,
            ]
        );

        AuthorProfile::updateOrCreate(
            ['user_id' => $authorSarah->id],
            [
                'slug' => 'sarah-jenkins',
                'bio' => 'Sarah has reported from 30+ capitals covering multilateral defense alliances, international law, and parliamentary elections.',
                'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                'credentials' => 'Chief Geopolitical Correspondent',
                'beat' => 'International Security & Alliances',
                'social_links' => ['twitter' => 'https://x.com/sjenkins_news'],
                'is_verified' => true,
            ]
        );

        AuthorProfile::updateOrCreate(
            ['user_id' => $authorDavid->id],
            [
                'slug' => 'david-kigozi',
                'bio' => 'David covers capital markets, global commodity flows, sovereign wealth funds, and central bank monetary policy.',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'credentials' => 'Markets & Macroeconomics Lead',
                'beat' => 'Global Finance & Sovereign Debt',
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'is_verified' => true,
            ]
        );

        // 2. Categories
        $catTech = Category::updateOrCreate(
            ['slug' => 'technology'],
            [
                'name' => 'Technology',
                'description' => 'Breakthrough innovations, artificial intelligence, cyber defense, and silicon architecture.',
                'accent_color' => '#7C3AED',
                'sort_order' => 1,
                'is_visible_in_nav' => true,
            ]
        );

        $catWorld = Category::updateOrCreate(
            ['slug' => 'world'],
            [
                'name' => 'World',
                'description' => 'Geopolitics, international diplomacy, human rights, and global conflicts.',
                'accent_color' => '#0066FF',
                'sort_order' => 2,
                'is_visible_in_nav' => true,
            ]
        );

        $catBusiness = Category::updateOrCreate(
            ['slug' => 'business'],
            [
                'name' => 'Business',
                'description' => 'Markets, central banking, energy trade, startups, and economic strategy.',
                'accent_color' => '#059669',
                'sort_order' => 3,
                'is_visible_in_nav' => true,
            ]
        );

        $catPolitics = Category::updateOrCreate(
            ['slug' => 'politics'],
            [
                'name' => 'Politics',
                'description' => 'Electoral trends, parliamentary legislation, constitutional law, and public policy.',
                'accent_color' => '#DC2626',
                'sort_order' => 4,
                'is_visible_in_nav' => true,
            ]
        );

        $catScience = Category::updateOrCreate(
            ['slug' => 'science'],
            [
                'name' => 'Science & Climate',
                'description' => 'Planetary climate systems, deep space discoveries, biotechnology, and physics.',
                'accent_color' => '#0D9488',
                'sort_order' => 5,
                'is_visible_in_nav' => true,
            ]
        );

        $catCulture = Category::updateOrCreate(
            ['slug' => 'culture'],
            [
                'name' => 'Culture & Life',
                'description' => 'Contemporary arts, literature, architectural design, and modern philosophy.',
                'accent_color' => '#D97706',
                'sort_order' => 6,
                'is_visible_in_nav' => true,
            ]
        );

        // Subcategories
        Category::updateOrCreate(['slug' => 'ai'], ['name' => 'Artificial Intelligence', 'parent_id' => $catTech->id, 'sort_order' => 1]);
        Category::updateOrCreate(['slug' => 'cybersecurity'], ['name' => 'Cybersecurity', 'parent_id' => $catTech->id, 'sort_order' => 2]);
        Category::updateOrCreate(['slug' => 'markets'], ['name' => 'Global Markets', 'parent_id' => $catBusiness->id, 'sort_order' => 1]);
        Category::updateOrCreate(['slug' => 'energy-trade'], ['name' => 'Energy Transition', 'parent_id' => $catBusiness->id, 'sort_order' => 2]);
        Category::updateOrCreate(['slug' => 'diplomacy'], ['name' => 'Diplomacy', 'parent_id' => $catWorld->id, 'sort_order' => 1]);

        // 3. Topics
        $topicAI = Topic::updateOrCreate(
            ['slug' => 'ai-accord-2026'],
            [
                'name' => '2026 Global AI Accord',
                'description' => 'The landmark multilateral treaty establishing compute safeguards, model audit certifications, and international containment protocols.',
                'is_featured' => true,
                'meta_title' => '2026 Global AI Treaty — Full Live Coverage, Text & Analysis',
                'meta_description' => 'Complete coverage of the Geneva AI Summit negotiations, signatures, and regulatory implications.',
                'faq_json' => [
                    [
                        'question' => 'What compute threshold triggers mandatory safety audits under the Accord?',
                        'answer' => 'Any model training run requiring greater than 10^26 total floating-point operations (FLOPs) must register and undergo third-party sovereign verification.'
                    ],
                    [
                        'question' => 'Which nations have ratified the agreement?',
                        'answer' => '42 nations including the European Union member states, the United States, Japan, the United Kingdom, Singapore, and Canada signed the initial draft in Geneva.'
                    ]
                ],
                'timeline_json' => [
                    ['date' => 'October 15, 2026', 'title' => 'Emergency Working Group Convened in Geneva', 'description' => 'Negotiators gather following breakthrough open-weights benchmark demonstrations.'],
                    ['date' => 'October 19, 2026', 'title' => 'Consensus on Hardware Export Verification', 'description' => 'Delegates agree to verifiable telemetry standards for data-center accelerator clusters.'],
                    ['date' => 'October 21, 2026', 'title' => 'Draft Text Signed by 42 Delegations', 'description' => 'Final treaty text opened for parliamentary ratification across member states.']
                ]
            ]
        );

        $topicEnergy = Topic::updateOrCreate(
            ['slug' => 'clean-energy-transition'],
            [
                'name' => 'Clean Energy Transition 2030',
                'description' => 'Tracking grid decentralization, utility-scale storage breakthroughs, and nuclear fusion pilot programs.',
                'is_featured' => true,
                'faq_json' => [
                    [
                        'question' => 'What is the role of solid-state storage in the 2030 milestone?',
                        'answer' => 'Solid-state sodium and silicon-anode cells provide grid stabilization with zero cobalt dependency and 4x cycle life over previous lithium-ion standards.'
                    ]
                ]
            ]
        );

        // 4. Tags
        $tagAI = Tag::updateOrCreate(['slug' => 'ai'], ['name' => 'Artificial Intelligence']);
        $tagGeopolitics = Tag::updateOrCreate(['slug' => 'geopolitics'], ['name' => 'Geopolitics']);
        $tagRegulation = Tag::updateOrCreate(['slug' => 'regulation'], ['name' => 'Tech Regulation']);
        $tagEnergy = Tag::updateOrCreate(['slug' => 'energy'], ['name' => 'Green Energy']);
        $tagMarkets = Tag::updateOrCreate(['slug' => 'markets'], ['name' => 'Financial Markets']);
        $tagSpace = Tag::updateOrCreate(['slug' => 'space'], ['name' => 'Space Exploration']);

        // 5. Rich Articles
        $articlesData = [
            [
                'title' => 'Global Powers Sign Historic Frontier AI Safety Framework in Geneva',
                'slug' => 'global-powers-sign-historic-frontier-ai-safety-framework-in-geneva',
                'standfirst' => 'Diplomats and computer scientists from 42 nations conclude six days of emergency deliberations, agreeing on binding compute thresholds, hardware telemetry, and independent red-team audits for next-generation intelligence models.',
                'body' => <<<HTML
<p class="lead"><strong>GENEVA</strong> — In what historians are already comparing to the 1968 Nuclear Non-Proliferation Treaty, delegations representing 42 governments and the world’s foremost computational research labs signed the landmark <em>Geneva Frontier Intelligence Accord</em> late Wednesday morning.</p>

<p>The treaty marks the first legally binding multilateral governance instrument specifically targeted at frontier synthetic cognitive systems capable of recursive architectural self-refinement.</p>

<h2>A Unified Safety Ceiling</h2>
<p>Central to the 84-page pact is a newly minted international compute metric. Any model training run engineered with an anticipated compute density exceeding \(10^{26}\) floating-point operations (FLOPs) must notify the newly created <em>International Algorithmic Safety Agency (IASA)</em>, headquartered in Vienna.</p>

<blockquote>
"We have chosen verifiable scientific transparency over reckless unilateral acceleration," declared Dr. Aris Thorne, chief scientific advisor to the negotiations. "True technological leadership is demonstrated not merely by how fast we can scale compute, but by how rigorously we can guarantee its alignment with human civil liberties."
</blockquote>

<h2>Sovereign Audits and Hardware Verifiability</h2>
<p>Unlike previous non-binding ministerial communiqués, the Geneva Accord introduces cryptographic hardware telemetry directly at the wafer fabrication level. Semiconductor foundries producing advanced accelerator nodes will embed tamper-evident measurement circuits that verify physical cluster sizes without intercepting proprietary model weights or customer training datasets.</p>

<p>Negotiators spent 48 consecutive hours debating exceptions for academic consortiums and open-source models. The final compromise explicitly preserves open research below the critical frontier threshold while establishing a global compute-pooling grant fund for developing economies.</p>

<h2>What Happens Next</h2>
<p>Member states have pledged to introduce domestic enacting legislation within 90 days. Early market response has been largely positive, with major technology index futures stabilizing following initial volatility.</p>
HTML,
                'category_id' => $catTech->id,
                'user_id' => $authorMarcus->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
                'hero_image_caption' => 'Delegates gather at the Palais des Nations in Geneva for the signing ceremony of the Frontier Intelligence Accord.',
                'reading_time_minutes' => 4,
                'view_count' => 14850,
                'is_breaking' => true,
                'is_featured' => true,
                'is_trending' => true,
                'is_editors_pick' => true,
                'published_at' => now()->subHours(2),
                'content_type' => 'news',
                'topics' => [$topicAI->id],
                'tags' => [$tagAI->id, $tagGeopolitics->id, $tagRegulation->id],
                'tldr' => '42 nations have signed the Geneva Accord, introducing a 10^26 FLOP notification threshold and independent red-team audits for frontier AI systems.',
                'key_facts' => [
                    '42 signatory nations signed the Geneva Frontier Intelligence Accord.',
                    'Mandatory registration for compute clusters training models above 10^26 FLOPs.',
                    'Establishes the International Algorithmic Safety Agency (IASA) in Vienna.',
                    'Semiconductor foundries will embed tamper-evident hardware telemetry.'
                ],
                'five_w_one_h' => [
                    'who' => '42 national delegations and leading AI research laboratories',
                    'what' => 'Signed the first binding multilateral frontier AI safety accord',
                    'when' => 'October 21, 2026',
                    'where' => 'Palais des Nations, Geneva, Switzerland',
                    'why' => 'To prevent uncontrolled frontier capability breakthroughs and secure civil safety',
                    'how' => 'Through hardware telemetry, compute registration thresholds, and independent audits'
                ],
                'faq_json' => [
                    [
                        'question' => 'Does this agreement affect open-source AI developers?',
                        'answer' => 'Models developed below the 10^26 FLOP ceiling remain exempt, protecting academic and grassroots open-source collaboration.'
                    ],
                    [
                        'question' => 'How will compliance be verified without leaking source code?',
                        'answer' => 'Hardware-level telemetry verifies compute scale without inspecting proprietary model architecture or datasets.'
                    ]
                ]
            ],
            [
                'title' => 'Central Banks Signal Coordinated Shift Toward Renewable Bond Guarantees',
                'slug' => 'central-banks-signal-coordinated-shift-toward-renewable-bond-guarantees',
                'standfirst' => 'A joint statement from the Bank for International Settlements outlines preferential liquidity terms for sovereign infrastructure bonds dedicated to grid decarbonization.',
                'body' => <<<HTML
<p><strong>BASEL</strong> — Central banking chiefs took unprecedented coordinated action today, publishing a joint prudential blueprint that systematically lowers capital adequacy reserves for banks holding accredited green sovereign infrastructure debt.</p>

<p>The reform, expected to unlock an estimated $1.2 trillion in institutional private capital over the next 18 months, shifts capital pricing incentives decisively toward long-horizon grid modernizations.</p>

<h2>Rewiring Capital Markets</h2>
<p>Under the revised Basel frameworks, Tier 1 financial institutions will receive a 25% risk-weight reduction for holding certified zero-carbon transition paper.</p>
HTML,
                'category_id' => $catBusiness->id,
                'user_id' => $authorDavid->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'The Bank for International Settlements headquarters in Basel, Switzerland.',
                'reading_time_minutes' => 3,
                'view_count' => 9420,
                'is_breaking' => false,
                'is_featured' => false,
                'is_trending' => true,
                'is_editors_pick' => true,
                'published_at' => now()->subHours(4),
                'content_type' => 'analysis',
                'topics' => [$topicEnergy->id],
                'tags' => [$tagMarkets->id, $tagEnergy->id],
                'tldr' => 'Central banks announce a 25% risk-weight reduction on certified green sovereign debt, unlocking an estimated $1.2 trillion.',
                'key_facts' => [
                    'BIS framework lowers capital adequacy requirements for green bonds.',
                    'Estimated $1.2 trillion in institutional capital mobilized.',
                    'Direct incentive for national power grid modernizations.'
                ]
            ],
            [
                'title' => 'Next-Gen Solid State Batteries Enter Volume Production Ahead of Schedule',
                'slug' => 'next-gen-solid-state-batteries-enter-volume-production-ahead-of-schedule',
                'standfirst' => 'Automotive and energy storage consortiums begin shipping commercial cells boasting 600 Wh/kg energy density with zero thermal runaway risk.',
                'body' => <<<HTML
<p><strong>NAGOYA</strong> — In a watershed achievement for commercial electrochemical engineering, commercial mass-manufacturing lines for solid-state ceramic electrolyte cells have reached steady-state yields 14 months earlier than consensus forecasts.</p>

<p>The new cell chemistry eliminates volatile liquid electrolytes in favor of a proprietary sulfur-doped garnet oxide separator, enabling sustained charging speeds of 10% to 80% in under seven minutes.</p>
HTML,
                'category_id' => $catScience->id,
                'user_id' => $editor->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1558441719-7557161b4764?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'Automated cleanroom assembly of ceramic solid-state battery cells.',
                'reading_time_minutes' => 3,
                'view_count' => 8340,
                'is_breaking' => false,
                'is_featured' => false,
                'is_trending' => true,
                'is_editors_pick' => false,
                'published_at' => now()->subHours(6),
                'content_type' => 'news',
                'topics' => [$topicEnergy->id],
                'tags' => [$tagEnergy->id],
                'tldr' => 'Solid-state battery cells with 600 Wh/kg and 7-minute charge times have entered commercial volume manufacturing.',
                'key_facts' => [
                    '600 Wh/kg energy density achieved on commercial lines.',
                    '10% to 80% charging achieved in seven minutes.',
                    'Zero thermal runaway risk under mechanical puncture tests.'
                ]
            ],
            [
                'title' => 'Space Agency Confirms Water-Ice Deposits in Deep Lunar Crater Outcrops',
                'slug' => 'space-agency-confirms-water-ice-deposits-in-deep-lunar-crater-outcrops',
                'standfirst' => 'Spectroscopic imaging from low polar orbit reveals vast sub-surface sheets of pure water ice within the permanently shadowed Shackleton crater.',
                'body' => <<<HTML
<p><strong>HOUSTON</strong> — High-resolution synthetic aperture radar and neutron spectrometer passes over the Moon’s South Pole have yielded conclusive proof of accessible, meters-thick water ice deposits.</p>

<p>The discovery fundamentally alters the economics of permanent lunar habitation and deep-space propellant manufacturing, providing in-situ resources for hydrogen-oxygen rocket refueling.</p>
HTML,
                'category_id' => $catScience->id,
                'user_id' => $editor->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'Radar mapping of permanently shadowed craters across the Lunar South Pole.',
                'reading_time_minutes' => 4,
                'view_count' => 7620,
                'is_breaking' => false,
                'is_featured' => false,
                'is_trending' => true,
                'is_editors_pick' => false,
                'published_at' => now()->subHours(8),
                'content_type' => 'news',
                'topics' => [],
                'tags' => [$tagSpace->id],
                'tldr' => 'Spectroscopic scans confirm accessible water ice sheets in Shackleton crater, securing future in-situ propellant production.',
                'key_facts' => [
                    'Meters-thick subsurface water-ice deposits confirmed.',
                    'Located in permanently shadowed regions of Shackleton Crater.',
                    'Critical for hydrogen-oxygen rocket fuel manufacturing.'
                ]
            ],
            [
                'title' => 'Parliamentary Coalition Reaches Compromise on Comprehensive Digital Rights Bill',
                'slug' => 'parliamentary-coalition-reaches-compromise-on-comprehensive-digital-rights-bill',
                'standfirst' => 'Lawmakers hammer out agreement balancing biometrics protection with streamlined developer compliance for homegrown tech startups.',
                'body' => <<<HTML
<p><strong>BRUSSELS</strong> — Following weeks of intense committee negotiations, legislative leaders announced a consensus text for the 2026 Citizens Digital Sovereignty Directive.</p>

<p>The legislation restricts unauthorized behavioral biometric harvesting in public spaces while providing explicit regulatory sandboxes and safe-harbor protections for pre-seed European technology founders.</p>
HTML,
                'category_id' => $catPolitics->id,
                'user_id' => $authorSarah->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'The European Parliament chamber in Brussels during deliberations on digital sovereignty.',
                'reading_time_minutes' => 3,
                'view_count' => 6110,
                'is_breaking' => false,
                'is_featured' => false,
                'is_trending' => true,
                'is_editors_pick' => true,
                'published_at' => now()->subHours(12),
                'content_type' => 'news',
                'topics' => [],
                'tags' => [$tagRegulation->id, $tagGeopolitics->id],
                'tldr' => 'New compromise bill limits public biometric profiling while introducing regulatory sandboxes for startups.',
                'key_facts' => [
                    'Prohibits real-time biometric scanning in public transit.',
                    'Safe-harbor provisions enacted for early-stage software companies.',
                    'Enforcement scheduled to take effect in Q2 2027.'
                ]
            ],
            [
                'title' => 'Urban Mobility Revolution: Electric Light-Rail Transforms Metro Commutes',
                'slug' => 'urban-mobility-revolution-electric-light-rail-transforms-metro-commutes',
                'standfirst' => 'Two years into deployment, zero-emission autonomous light-rail network slashes inner-city congestion by 38% and revitalizes public squares.',
                'body' => <<<HTML
<p><strong>VIENNA</strong> — Across three European metropolises, municipal authorities report unprecedented reductions in vehicular gridlock and localized particulate emissions following the full activation of grade-separated autonomous light transit arteries.</p>

<p>Urban planners emphasize how the reclaimed roadway space has been repurposed for shaded pedestrian boulevards, local artisan commerce, and permeable stormwater gardens.</p>
HTML,
                'category_id' => $catCulture->id,
                'user_id' => $authorSarah->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'A light-rail car glides across a pedestrianized transit boulevard.',
                'reading_time_minutes' => 3,
                'view_count' => 5400,
                'is_breaking' => false,
                'is_featured' => true,
                'is_trending' => false,
                'is_editors_pick' => false,
                'published_at' => now()->subHours(15),
                'content_type' => 'explainer',
                'topics' => [],
                'tags' => [$tagEnergy->id],
                'tldr' => 'Autonomous electric light rail has reduced city congestion by 38% and transformed urban pedestrian centers.',
                'key_facts' => [
                    '38% reduction in peak-hour inner-city traffic.',
                    'Zero tailpipe emissions and 100% renewable grid sourcing.',
                    '45 kilometers of reclaimed public squares and pedestrian ways.'
                ]
            ],
            [
                'title' => 'The Ethical Imperative of Open Source Compute: An Editorial Essay',
                'slug' => 'the-ethical-imperative-of-open-source-compute-an-editorial-essay',
                'standfirst' => 'Restricting high-performance computation behind corporate tollbooths poses a far greater democratic hazard than distributed open science ever could.',
                'body' => <<<HTML
<p>When the history of 21st-century technology is written, the critical inflection point will not be which proprietary lab reached artificial general intelligence first. It will be whether the foundational architecture of machine cognition remained an open public good or degenerated into an unprecedented corporate cartel.</p>

<p>History offers a consistent lesson: whenever a general-purpose technology — from the printing press to the internet protocol suite — was kept open and permissionless, human flourishing accelerated. Whenever knowledge was sequestered behind sovereign monopolies, stagnation and systemic fragility followed.</p>
HTML,
                'category_id' => $catTech->id,
                'user_id' => $authorMarcus->id,
                'hero_image_url' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                'hero_image_caption' => 'Open compute nodes undergoing benchmark testing.',
                'reading_time_minutes' => 5,
                'view_count' => 4320,
                'is_breaking' => false,
                'is_featured' => false,
                'is_trending' => false,
                'is_editors_pick' => true,
                'published_at' => now()->subHours(18),
                'content_type' => 'opinion',
                'topics' => [$topicAI->id],
                'tags' => [$tagAI->id],
                'tldr' => 'Concentrating computing power into private monopolies risks democratic accountability; open science remains our strongest safeguard.',
                'key_facts' => [
                    'Open models foster distributed safety verification and auditability.',
                    'Historical parallels with the early open-source internet protocols.',
                    'Need for sovereign compute grants for public universities.'
                ]
            ]
        ];

        foreach ($articlesData as $data) {
            $topics = $data['topics'] ?? [];
            $tags = $data['tags'] ?? [];
            $tldr = $data['tldr'] ?? null;
            $keyFacts = $data['key_facts'] ?? [];
            $fiveW = $data['five_w_one_h'] ?? null;
            $faq = $data['faq_json'] ?? null;

            unset($data['topics'], $data['tags'], $data['tldr'], $data['key_facts'], $data['five_w_one_h'], $data['faq_json']);

            $data['status'] = 'published';
            $data['primary_category_id'] = $data['category_id'];
            unset($data['category_id']);

            $article = Article::updateOrCreate(['slug' => $data['slug']], $data);

            if (!empty($topics)) {
                $article->topics()->sync($topics);
            }
            if (!empty($tags)) {
                $article->tags()->sync($tags);
            }

            ArticleSeo::updateOrCreate(
                ['article_id' => $article->id],
                [
                    'meta_title' => $article->title . ' | NewsPortal',
                    'meta_description' => Str::limit($article->standfirst, 155),
                    'focus_keyword' => $article->tags()->first()?->name ?? 'News',
                    'score' => 92,
                ]
            );

            ArticleAiMeta::updateOrCreate(
                ['article_id' => $article->id],
                [
                    'tldr' => $tldr,
                    'key_facts' => $keyFacts,
                    'five_w_one_h' => $fiveW,
                    'faq_json' => $faq,
                    'aeo_score' => 95,
                ]
            );

            // Add sample comment
            Comment::firstOrCreate(
                ['article_id' => $article->id, 'author_name' => 'Claire DeWitt'],
                [
                    'content' => 'Outstanding and timely reporting. The international governance implications here cannot be overstated.',
                    'status' => 'approved',
                ]
            );
        }
    }
}
