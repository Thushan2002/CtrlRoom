<?php

namespace Database\Seeders;

use App\Models\Computer;
use Illuminate\Database\Seeder;

class ComputerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 20 available computers
        Computer::factory()
            ->count(20)
            ->available()
            ->create();

        // Create 5 computers under maintenance
        Computer::factory()
            ->count(5)
            ->underMaintenance()
            ->create();

        // Create 10 random computers (mixed status)
        Computer::factory()
            ->count(10)
            ->create();
    }
}
