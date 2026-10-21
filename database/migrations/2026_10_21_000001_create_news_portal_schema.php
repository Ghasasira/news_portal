<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add role column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('reader')->after('email');
        });

        // 2. Author profiles
        Schema::create('author_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->text('bio')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('credentials')->nullable();
            $table->string('beat')->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        // 3. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('accent_color')->default('#0066FF');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible_in_nav')->default(true);
            $table->timestamps();
        });

        // 4. Topics
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->json('faq_json')->nullable();
            $table->json('timeline_json')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });

        // 5. Tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 6. Series
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 7. Articles
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('standfirst')->nullable();
            $table->longText('body');
            $table->string('content_type')->default('news');
            $table->string('status')->default('draft');
            $table->foreignId('primary_category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('series_id')->nullable()->constrained('series')->nullOnDelete();
            $table->integer('series_order')->default(0);
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_caption')->nullable();
            $table->integer('reading_time_minutes')->default(3);
            $table->unsignedBigInteger('view_count')->default(0);
            $table->boolean('is_breaking')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_editors_pick')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'published_at']);
            $table->index('is_breaking');
            $table->index('is_featured');
            $table->index('is_trending');
        });

        // 8. Pivot: article_topic
        Schema::create('article_topic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['article_id', 'topic_id']);
        });

        // 9. Pivot: article_tag
        Schema::create('article_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['article_id', 'tag_id']);
        });

        // 10. Article SEO
        Schema::create('article_seos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete()->unique();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('social_image_url')->nullable();
            $table->string('focus_keyword')->nullable();
            $table->integer('score')->default(85);
            $table->timestamps();
        });

        // 11. Article AI Meta (AEO & GEO)
        Schema::create('article_ai_metas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete()->unique();
            $table->text('tldr')->nullable();
            $table->json('key_facts')->nullable();
            $table->json('five_w_one_h')->nullable();
            $table->json('faq_json')->nullable();
            $table->integer('aeo_score')->default(90);
            $table->timestamps();
        });

        // 12. Article Revisions
        Schema::create('article_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('standfirst')->nullable();
            $table->longText('body');
            $table->string('note')->nullable();
            $table->timestamps();
        });

        // 13. Comments
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->text('content');
            $table->string('status')->default('approved');
            $table->timestamps();
        });

        // 14. Newsletter Subscribers
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 15. Saved Articles (Bookmarks)
        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'article_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_articles');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('article_revisions');
        Schema::dropIfExists('article_ai_metas');
        Schema::dropIfExists('article_seos');
        Schema::dropIfExists('article_tag');
        Schema::dropIfExists('article_topic');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('series');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('author_profiles');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
