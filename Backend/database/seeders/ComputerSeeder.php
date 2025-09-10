<?php

namespace Database\Seeders;

use App\Models\Computer;
use App\Models\Software;
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

        // Add software to some computers
        $computers = Computer::all();
        foreach ($computers as $computer) {
            // Add 3-8 software items to each computer
            $softwareCount = rand(3, 8);
            Software::factory()
                ->count($softwareCount)
                ->create(['computer_id' => $computer->id]);
        }
    }
}
