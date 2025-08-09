<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComputersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('computers', function (Blueprint $table) {
            $table->id();
            $table->enum('system_status', ['available', 'under_maintenance'])
                  ->default('available');
            $table->json('complaints')->nullable();
            $table->string('os')->nullable();
            $table->string('processor')->nullable();
            $table->string('ram')->nullable();
            $table->string('storage')->nullable();
            $table->string('graphics_card')->nullable();
            $table->string('motherboard')->nullable();
            $table->string('location')->nullable();
            $table->string('asset_tag')->unique()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('computers');
    }
}
