<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SoftwareFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $softwareNames = [
            'Visual Studio Code', 'IntelliJ IDEA', 'Eclipse', 'Sublime Text',
            'Microsoft Office', 'Google Chrome', 'Firefox', 'Safari',
            'Adobe Photoshop', 'Adobe Illustrator', 'GIMP', 'Blender',
            'Steam', 'Epic Games Launcher', 'Discord', 'Slack',
            'Node.js', 'Python', 'Java Runtime', 'Docker',
            'Windows Defender', 'Malwarebytes', 'Norton', 'McAfee',
            'WinRAR', '7-Zip', 'CCleaner', 'VLC Media Player'
        ];

        $categories = [
            'Development', 'Productivity', 'Gaming', 'Multimedia',
            'Security', 'Utilities', 'Other'
        ];

        $vendors = [
            'Microsoft', 'Google', 'Adobe', 'Mozilla', 'JetBrains',
            'Valve', 'Epic Games', 'Discord Inc.', 'Slack Technologies',
            'Oracle', 'Docker Inc.', 'Malwarebytes', 'Symantec',
            'RARLAB', 'VideoLAN', 'Piriform'
        ];

        $name = $this->faker->randomElement($softwareNames);
        $category = $this->faker->randomElement($categories);
        $vendor = $this->faker->randomElement($vendors);

        return [
            'computer_id' => \App\Models\Computer::factory(),
            'name' => $name,
            'version' => $this->faker->numerify('#.#.#'),
            'category' => $category,
            'description' => $this->faker->optional(0.7)->sentence(),
            'vendor' => $vendor,
            'install_date' => $this->faker->optional(0.8)->dateTimeBetween('-2 years', 'now'),
            'is_licensed' => $this->faker->boolean(60), // 60% chance of being licensed
        ];
    }
}
