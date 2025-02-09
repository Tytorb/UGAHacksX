// sensors and devices imports
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "pitches.h"
#include <math.h>

// OLED Display Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET 4
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Buzzer Configuration
const int BUZZER_PIN = 18;

// Light Sensor (LDR) Configuration
#define LIGHT_SENSOR_PIN 36

// Thermistor Configuration
#define THERMISTOR_PIN 35
#define SERIES_RESISTOR 10000
#define BETA 3950
#define NOMINAL_RESISTANCE 10000
#define NOMINAL_TEMPERATURE 298.15

// Melody Notes
int melody[] = {
  NOTE_E5, NOTE_E5, NOTE_E5,
  NOTE_E5, NOTE_E5, NOTE_E5,
  NOTE_E5, NOTE_G5, NOTE_C5, NOTE_D5,
  NOTE_E5,
  NOTE_F5, NOTE_F5, NOTE_F5, NOTE_F5,
  NOTE_F5, NOTE_E5, NOTE_E5, NOTE_E5, NOTE_E5,
  NOTE_E5, NOTE_D5, NOTE_D5, NOTE_E5,
  NOTE_D5, NOTE_G5
};

int noteDurations[] = {
  8, 10
};


void SetupDevices() {
  analogSetAttenuation(ADC_11db);

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED initialization failed");
    while (1)
      ;
  }
  display.display();
  delay(2000);
  display.clearDisplay();

  // Play Melody on Buzzer
  int size = sizeof(noteDurations) / sizeof(int);
  for (int thisNote = 0; thisNote < size; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZER_PIN, melody[thisNote], noteDuration);
    delay(noteDuration * 1.30);
    noTone(BUZZER_PIN);
  }
}

void playSong() {
  int size = sizeof(noteDurations) / sizeof(int);
  for (int thisNote = 0; thisNote < size; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(BUZZER_PIN, melody[thisNote], noteDuration);
    delay(noteDuration * 1.30);
    noTone(BUZZER_PIN);
  }

}

int readLightSensor() {
  // Read Light Sensor
  int analogValue = analogRead(LIGHT_SENSOR_PIN);
  Serial.print("Light Sensor Value = ");
  Serial.print(analogValue);
  Serial.print(" => ");
  if (analogValue < 40) {
    Serial.println("Dark");
  } else if (analogValue < 800) {
    Serial.println("Dim");
  } else if (analogValue < 2000) {
    Serial.println("Light");
  } else if (analogValue < 3200) {
    Serial.println("Bright");
  } else {
    Serial.println("Very Bright");
  }
  return analogValue;
}

float readThermistorTemperature(String hiddenByu, String lastHiddenu) {
  // Read Thermistor Temperature
  int adcValue = analogRead(THERMISTOR_PIN);
  float voltage = adcValue * (3.3 / 4095.0);
  float thermistorResistance = SERIES_RESISTOR * ((3.3 / voltage) - 1);
  float temperatureKelvin = 1.0 / ((1.0 / NOMINAL_TEMPERATURE) + (log(thermistorResistance / NOMINAL_RESISTANCE) / BETA));
  float temperatureCelsius = temperatureKelvin - 273.15;
  float temperatureFahrenheit = (temperatureCelsius * 1.8) + 32;

  // Print Temperature to Serial Monitor
  Serial.print("Temperature: ");
  Serial.print(temperatureFahrenheit, 2);
  Serial.println(" °F");
    // Display Temperature on OLED
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 5);
  display.print("Temp: ");
  display.print(temperatureFahrenheit, 0);
  display.print("F Hider:");
  display.print(lastHiddenu.c_str());
  display.print(" On:");
  display.print(hiddenByu.c_str());
  display.display();
  return temperatureFahrenheit;
}