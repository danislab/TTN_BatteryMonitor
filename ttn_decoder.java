function Decoder(bytes, port) {

	var temperature_mean = -20 + ((bytes[0] << 2) + ((bytes[1] & 0xC0) >> 6)) * 100 / 1024;
	var temperature_min = temperature_mean - (((bytes[1] & 0x3F) << 1) + (bytes[2] & 0x01)) * 20 / 128;
	var temperature_max = temperature_mean + (bytes[2] & 0x7F) * 20 / 128;
	var cell_voltage_mean = 2.45 + ((bytes[3] << 8) + bytes[4]) * 1.8 / 65536;
	var cell_voltage_min = cell_voltage_mean - bytes[5] * 0.25 / 256;
	var cell_voltage_max = cell_voltage_mean + bytes[6] * 0.25 / 256;
	var SOC = bytes[7];
	var SOH = bytes[8];
	// leave this
	var temperature = (bytes[0]) / 10;
	var humidity = (bytes[1]);

	return {
		measurement: {
			temperature_mean: temperature_mean,
			temperature_min: temperature_min,
			temperature_max: temperature_max,
			cell_voltage_mean: cell_voltage_mean,
			cell_voltage_min: cell_voltage_min,
			cell_voltage_max: cell_voltage_max,
			SOC: SOC,
			SOH: SOH,
			temperature: temperature,
			humidity: humidity
		},
	};
}
