class dataCity {
    constructor(code, name, employees, city, insee, probrain, weather, tmin, tmax, sunhours, weatherLabel){
        this.code= code; 
        this.name= name;
        this.employees= employees;
        this.city= city;
        this.insee= insee;
        this.probrain= probrain;
        this.weather= weather;
        this.tmin = tmin;
        this.tmax = tmax;
        this.sunhours = sunhours;
        this.weatherLabel = weatherLabel;
    }
}
module.exports = dataCity;