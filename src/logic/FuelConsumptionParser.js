const IFuelConsumption = require('./IFuelConsumption');

class FuelConsumptionParser {
  get errorMessage () { return 'Parse error: ' + this._errorMessage; }

  get result () { return this._fuelConsumption; }

  constructor (fuelConsumptionFromJSON) {
    this._fuelConsumptionFromJSON = fuelConsumptionFromJSON;
  }

  parse () {
    if (!IFuelConsumption.isImplemented(this._fuelConsumptionFromJSON)) {
      this._errorMessage = 'not all required properties';
      return false;
    }

    const fuelConsumption = {};
    fuelConsumption.liters = parseFloat(this._fuelConsumptionFromJSON.liters);
    if (!fuelConsumption.liters) {
      this._errorMessage = 'invalid liters';
      return false;
    }

    fuelConsumption.kilometers = parseFloat(this._fuelConsumptionFromJSON.kilometers);
    if (!fuelConsumption.kilometers) {
      this._errorMessage = 'invalid kilometers';
      return false;
    }

    fuelConsumption.fuelPrice = parseFloat(this._fuelConsumptionFromJSON.fuelPrice);
    if (!fuelConsumption.fuelPrice) {
      this._errorMessage = 'invalid fuelPrice';
      return false;
    }

    fuelConsumption.created = this._fuelConsumptionFromJSON.created;
    this._fuelConsumption = fuelConsumption;
    return true;
  }
}

module.exports = FuelConsumptionParser;
