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
        Schema::table('saved_articles', function (Blueprint $table) {
            $table->foreignId('reader_id')->nullable()->after('id')->constrained('readers')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->change();
            $table->index(['reader_id', 'article_id']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->foreignId('reader_id')->nullable()->after('user_id')->constrained('readers')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['reader_id']);
            $table->dropColumn('reader_id');
        });

        Schema::table('saved_articles', function (Blueprint $table) {
            $table->dropForeign(['reader_id']);
            $table->dropIndex(['reader_id', 'article_id']);
            $table->dropColumn('reader_id');
        });
    }
};
