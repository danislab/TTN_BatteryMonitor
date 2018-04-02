function Decoder(bytes, port) {

	var temperature_mean = -20 + ((bytes[0] << 2) + ((bytes[1] & 0xC0) >> 6)) * 100 / 1024;
	var temperature_min = temperature_mean - (((bytes[1] & 0x3F) << 1) + (bytes[2] & 0x01)) * 20 / 128;
	var temperature_max = temperature_mean + (bytes[2] & 0x7F) * 20 / 128;
	var cell_voltage_mean = 2.45 + ((bytes[3] << 8) + bytes[4]) * 1.8 / 65536;
	var cell_voltage_min = cell_voltage_mean - bytes[5] * 0.25 / 256;
	var cell_voltage_max = cell_voltage_mean + bytes[6] * 0.25 / 256;
	var soc = bytes[7];
	var soh = bytes[8];
	var charged_capacity_1cs = (bytes[9] & 0x7F);
	var discharged_capacity_1cs  = bytes[10];
	// leave this
	var temperature = (bytes[0]) / 10;
	var humidity = (bytes[1]);

	return {
		measurement: {
			temperature_mean: Math.round(temperature_mean * 100) / 100,
			temperature_min: Math.round(temperature_min * 100) / 100,
			temperature_max: Math.round(temperature_max * 100) / 100,
			cell_voltage_mean: Math.round(cell_voltage_mean * 1000) / 1000,
			cell_voltage_min: Math.round(cell_voltage_min * 1000) / 1000,
			cell_voltage_max: Math.round(cell_voltage_max * 1000) / 1000,
			soc: soc,
			soh: soh,
			charged_capacity_1cs: charged_capacity_1cs,
			discharged_capacity_1cs: discharged_capacity_1cs,
			temperature: temperature,
			humidity: humidity
		},
	};
}
