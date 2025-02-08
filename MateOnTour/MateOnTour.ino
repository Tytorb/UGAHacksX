#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>


// littleFS Imports
#include <Arduino.h>
#include "FS.h"
#include <LittleFS.h>
#define FORMAT_LITTLEFS_IF_FAILED true


// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define WRITE_HIDER_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define WRITE_HIDE_DATE_CHARACTERISTIC_UUID "489954f8-92c2-4449-b3d7-6ac3e41bcce8"

BLEUUID *WRITE_HIDER_UUID = new BLEUUID(WRITE_HIDER_CHARACTERISTIC_UUID);

// Temp Data
BLECharacteristic bmeTemperatureFahrenheitCharacteristics("f78ebbff-c8b7-4107-93de-889a6a06d408", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor bmeTemperatureFahrenheitDescriptor(BLEUUID((uint16_t)0x2902));

#define maxStringLength 50
String lastHider = "unset";
String lastHideDate = "unset";

bool deviceConnected = false;

double tempF;

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };
  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
  }
};

void setup() {
  Serial.begin(115200);

  // Settng up recording files
  if (!LittleFS.begin(FORMAT_LITTLEFS_IF_FAILED)) {
    Serial.println("LittleFS Mount Failed");
    return;
  }
  if (!doesFileExit(LittleFS, "/tempF.txt")) {
    Serial.println("Creating tempF file");
    writeFile(LittleFS, "/tempF.txt", "");
  } else { 
    Serial.println("Found existing Tempf file");
  }

  //Callback declared here so that writeFile is in scope
  class SetValuesCallback : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();

      if (value.length() > 0) {
        Serial.println("*********");
        if (pCharacteristic->getUUID().equals(*WRITE_HIDER_UUID)) {
          Serial.print("New Hider: ");
          for (int i = 0; i < value.length(); i++) {
            Serial.print(value[i]);
          }

          if (value.length() < maxStringLength) {
            lastHider = value;
            writeFile(LittleFS, "/lastHider.txt", value.c_str());
          }
        } else {
          Serial.print("New HideDate: ");
          for (int i = 0; i < value.length(); i++) {
            Serial.print(value[i]);
          }

          if (value.length() < maxStringLength) {
            lastHideDate = value;
            writeFile(LittleFS, "/lastHideDate.txt", value.c_str());
          }
        }
        Serial.println();
        Serial.println("*********");
      }
    }
  };

  // Loads old hidder data
  lastHider = readFile(LittleFS, "lastHider.txt");
  lastHideDate = readFile(LittleFS, "lastHideDate.txt");

  BLEDevice::init("MateOnTour - Rocky");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService(SERVICE_UUID);

  SetValuesCallback *valuesCallback = new SetValuesCallback();

  BLECharacteristic *pHiderCharacteristic =
    pService->createCharacteristic(WRITE_HIDER_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHiderCharacteristic->setCallbacks(valuesCallback);
  pHiderCharacteristic->setValue(lastHider);


  BLECharacteristic *pHideDateCharacteristic =
    pService->createCharacteristic(WRITE_HIDE_DATE_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHideDateCharacteristic->setCallbacks(valuesCallback);
  pHiderCharacteristic->setValue(lastHideDate);

  pService->addCharacteristic(&bmeTemperatureFahrenheitCharacteristics);
  bmeTemperatureFahrenheitDescriptor.setValue("Temperature Fahrenheit");
  bmeTemperatureFahrenheitCharacteristics.addDescriptor(&bmeTemperatureFahrenheitDescriptor);

  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  if (deviceConnected) {
    // put your main code here, to run repeatedly:
    tempF = random(500) / 10;
    static char temperatureFTemp[6];
    dtostrf(tempF, 6, 2, temperatureFTemp);
    //Set temperature Characteristic value and notify connected client
    bmeTemperatureFahrenheitCharacteristics.setValue(temperatureFTemp);
    bmeTemperatureFahrenheitCharacteristics.notify();
    Serial.print(tempF);
    appendFile(LittleFS, "/tempF.txt", temperatureFTemp);
    appendFile(LittleFS, "/tempF.txt", " ");
    delay(1000);
  }
}
