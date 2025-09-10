<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSoftwareTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('software', function (Blueprint $table) {
            $table->id();
            $table->foreignId('computer_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('version');
            $table->string('category')->nullable(); // e.g., 'Development', 'Productivity', 'Gaming'
            $table->text('description')->nullable();
            $table->string('vendor')->nullable();
            $table->date('install_date')->nullable();
            $table->boolean('is_licensed')->default(false);
            $table->timestamps();
            
            // Index for better performance
            $table->index(['computer_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('software');
    }
}
