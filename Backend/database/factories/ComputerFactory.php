<?php

namespace Database\Factories;

use App\Models\Computer;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComputerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Computer::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $osOptions = ['Windows 10', 'Windows 11', 'Ubuntu 20.04', 'Ubuntu 22.04', 'macOS Monterey', 'macOS Ventura'];
        $processorOptions = [
            'Intel Core i5-10400',
            'Intel Core i7-11700',
            'AMD Ryzen 5 5600X',
            'AMD Ryzen 7 5800X',
            'Intel Core i9-12900K',
            'AMD Ryzen 9 5900X'
        ];
        $ramOptions = ['8GB DDR4', '16GB DDR4', '32GB DDR4', '8GB DDR5', '16GB DDR5', '32GB DDR5'];
        $storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD + 256GB SSD'];
        $graphicsOptions = [
            'Intel UHD Graphics',
            'NVIDIA GTX 1660',
            'NVIDIA RTX 3060',
            'NVIDIA RTX 3070',
            'AMD Radeon RX 6600',
            'AMD Radeon RX 6700 XT'
        ];
        $motherboardOptions = [
            'ASUS PRIME B450M-A',
            'MSI B550M PRO-B',
            'Gigabyte B550 AORUS',
            'ASRock Z590 Steel Legend',
            'ASUS ROG STRIX B550-F'
        ];
        $locationOptions = ['Computer Lab 1', 'Computer Lab 2', 'Library', 'Study Room A', 'Study Room B', 'Faculty Office'];

        return [
            'system_status' => $this->faker->randomElement(Computer::getSystemStatuses()),
            'complaints' => $this->faker->optional(0.3)->randomElements([
                'Screen flickering',
                'Slow boot time',
                'Keyboard not working',
                'Mouse not responding',
                'Internet connection issues',
                'Software crashes frequently',
                'Blue screen errors',
                'USB ports not working'
            ], $this->faker->numberBetween(1, 3)),
            'os' => $this->faker->randomElement($osOptions),
            'processor' => $this->faker->randomElement($processorOptions),
            'ram' => $this->faker->randomElement($ramOptions),
            'storage' => $this->faker->randomElement($storageOptions),
            'graphics_card' => $this->faker->randomElement($graphicsOptions),
            'motherboard' => $this->faker->randomElement($motherboardOptions),
            'location' => $this->faker->randomElement($locationOptions),
            'asset_tag' => 'PC-' . $this->faker->unique()->numberBetween(1000, 9999),
        ];
    }

    /**
     * Indicate that the computer is available.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function available()
    {
        return $this->state(function (array $attributes) {
            return [
                'system_status' => Computer::STATUS_AVAILABLE,
                'complaints' => null,
            ];
        });
    }

    /**
     * Indicate that the computer is under maintenance.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function underMaintenance()
    {
        return $this->state(function (array $attributes) {
            return [
                'system_status' => Computer::STATUS_UNDER_MAINTENANCE,
                'complaints' => $this->faker->randomElements([
                    'Hardware failure',
                    'Software corruption',
                    'Virus infection',
                    'Hard drive failure',
                    'Memory issues',
                    'Power supply problems'
                ], $this->faker->numberBetween(1, 2)),
            ];
        });
    }
}
