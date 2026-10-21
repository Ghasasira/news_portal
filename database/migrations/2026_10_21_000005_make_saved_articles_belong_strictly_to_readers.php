<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Backup any existing reader bookmarks before recreating table
        $existing = [];
        if (Schema::hasTable('saved_articles') && Schema::hasColumn('saved_articles', 'reader_id')) {
            $existing = DB::table('saved_articles')
                ->whereNotNull('reader_id')
                ->select('reader_id', 'article_id', 'created_at', 'updated_at')
                ->get()
                ->map(fn ($r) => (array) $r)
                ->toArray();
        }

        Schema::dropIfExists('saved_articles');

        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reader_id')->constrained('readers')->cascadeOnDelete();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['reader_id', 'article_id']);
        });

        if (! empty($existing)) {
            DB::table('saved_articles')->insert($existing);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_articles');

        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reader_id')->nullable()->constrained('readers')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
